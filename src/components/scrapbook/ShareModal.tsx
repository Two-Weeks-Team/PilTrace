'use client';

import { useState, FormEvent } from 'react';

interface ShareModalProps {
  essayId: string;
  existingCode?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ essayId, existingCode, isOpen, onClose }: ShareModalProps) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(existingCode || null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError('4자리 숫자를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/essay/${essayId}/pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setError('PIN이 이미 설정되어 있습니다.');
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || '오류가 발생했습니다.');
      }

      setCode(data.data.uniqueCode);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-sm p-6 bg-white rounded-2xl shadow-xl border border-[var(--border-light)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--earthy-brown)] transition-colors"
          aria-label="닫기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {code ? (
          <div className="flex flex-col items-center text-center mt-2">
            <h2 id="modal-title" className="text-2xl font-handwriting text-[var(--earthy-brown)] mb-2">
              공유 코드가 발급되었어요!
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              이 번호로 <span className="font-semibold">/access</span>에서 에세이를 조회할 수 있어요.
            </p>
            
            <div className="w-full p-4 mb-6 bg-[var(--cream)] border border-[var(--border-light)] rounded-xl">
              <div className="text-4xl font-mono tracking-widest text-[var(--star-brown)] font-bold">
                {code}
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-3 px-4 bg-[var(--sage-green)] hover:bg-[var(--sage-green-dark)] text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              aria-label="코드 복사하기"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  복사 완료!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  코드 복사하기
                </>
              )}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col mt-2">
            <h2 id="modal-title" className="text-2xl font-handwriting text-[var(--earthy-brown)] mb-2 text-center">
              에세이 공유하기
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-6 text-center">
              공유용 4자리 PIN 번호를 설정해주세요.
            </p>

            <div className="mb-6">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full text-center text-3xl tracking-[0.5em] py-4 bg-[var(--cream)] border border-[var(--border-light)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)] focus:border-transparent transition-all text-[var(--earthy-brown)] font-mono"
                placeholder="0000"
                aria-label="4자리 PIN 번호 입력"
                disabled={loading}
              />
              {error && (
                <p className="mt-2 text-sm text-red-500 text-center" role="alert">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || pin.length !== 4}
              className="w-full py-3 px-4 bg-[var(--sage-green)] hover:bg-[var(--sage-green-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
              aria-label="PIN 설정하고 공유 코드 발급받기"
            >
              {loading ? '발급 중...' : '공유 코드 발급받기'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
