import postgres from 'postgres'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const DATABASE_URL = process.env.DATABASE_URL || process.argv[2]

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set')
  process.exit(1)
}

const sql = postgres(DATABASE_URL, {
  ssl: { rejectUnauthorized: false },
  max: 1,
  idle_timeout: 5,
})

const migrationPath = resolve(__dirname, '../supabase/migrations/001_initial_schema.sql')
const migrationSQL = readFileSync(migrationPath, 'utf-8')

// Split by semicolons but respect $$ blocks
function splitStatements(input) {
  const statements = []
  let current = ''
  let inDollarBlock = false

  const lines = input.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Skip comments
    if (trimmed.startsWith('--') && !inDollarBlock) {
      continue
    }

    if (trimmed.includes('$$')) {
      const count = (trimmed.match(/\$\$/g) || []).length
      if (count === 1) {
        inDollarBlock = !inDollarBlock
      }
      // count === 2 means open and close on same line
    }

    current += line + '\n'

    if (trimmed.endsWith(';') && !inDollarBlock) {
      const stmt = current.trim()
      if (stmt && stmt !== ';') {
        statements.push(stmt)
      }
      current = ''
    }
  }

  if (current.trim()) {
    statements.push(current.trim())
  }

  return statements
}

async function run() {
  console.log('Connecting to Supabase PostgreSQL...')
  
  try {
    // Test connection
    const [{ now }] = await sql`SELECT NOW() as now`
    console.log(`Connected at ${now}`)

    const statements = splitStatements(migrationSQL)
    console.log(`Running ${statements.length} statements...\n`)

    let success = 0
    let skipped = 0

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i]
      const preview = stmt.substring(0, 80).replace(/\n/g, ' ')
      
      try {
        await sql.unsafe(stmt)
        console.log(`  [${i + 1}/${statements.length}] OK: ${preview}...`)
        success++
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`  [${i + 1}/${statements.length}] SKIP (exists): ${preview}...`)
          skipped++
        } else {
          console.error(`  [${i + 1}/${statements.length}] FAIL: ${preview}...`)
          console.error(`    Error: ${err.message}`)
        }
      }
    }

    console.log(`\nDone: ${success} ok, ${skipped} skipped`)

    // Verify tables exist
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `
    console.log('\nPublic tables:', tables.map(t => t.table_name).join(', '))

  } catch (err) {
    console.error('Connection failed:', err.message)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

run()
