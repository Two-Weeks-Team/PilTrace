CREATE TYPE "public"."essay_focus" AS ENUM('experience', 'feeling');--> statement-breakpoint
CREATE TYPE "public"."writing_style" AS ENUM('question', 'list', 'word', 'story');--> statement-breakpoint
CREATE TABLE "diaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "essays" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"diary_id" uuid NOT NULL,
	"user_id" uuid,
	"unique_code" varchar(6),
	"pin_hash" text,
	"content" text NOT NULL,
	"focus" "essay_focus" NOT NULL,
	"style" "writing_style" NOT NULL,
	"todays_word" text,
	"survey_data" jsonb,
	"revision_count" integer DEFAULT 0 NOT NULL,
	"agent_metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "essays_unique_code_unique" UNIQUE("unique_code")
);
--> statement-breakpoint
CREATE TABLE "survey_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"essay_id" uuid NOT NULL,
	"questions" jsonb NOT NULL,
	"answers" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"nickname" text,
	"consented_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "diaries" ADD CONSTRAINT "diaries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essays" ADD CONSTRAINT "essays_diary_id_diaries_id_fk" FOREIGN KEY ("diary_id") REFERENCES "public"."diaries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "essays" ADD CONSTRAINT "essays_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_essay_id_essays_id_fk" FOREIGN KEY ("essay_id") REFERENCES "public"."essays"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "diaries_user_id_idx" ON "diaries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "essays_user_id_idx" ON "essays" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "essays_unique_code_idx" ON "essays" USING btree ("unique_code");