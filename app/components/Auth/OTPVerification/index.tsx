'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  verifyOTPRequest,
  resendOTPRequest,
} from '@/lib/store/slices/authSlice';
import styles from './OTPVerification.module.css';

interface OTPVerificationProps {
  email: string;
}

export default function OTPVerification({ email }: OTPVerificationProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const canResend = countdown === 0;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== '')) {
      const code = newOtp.join('');
      dispatch(verifyOTPRequest({ email, code }));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);

    if (newOtp.every((digit) => digit !== '')) {
      const code = newOtp.join('');
      dispatch(verifyOTPRequest({ email, code }));
    }
  };

  const handleResend = () => {
    if (!canResend || isLoading) return;
    dispatch(resendOTPRequest({ email }));
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Xác thực OTP</h2>
        <p className={styles.subtitle}>
          Mã xác thực đã được gửi đến
          <br />
          <strong>{email}</strong>
        </p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.otpInputs} onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={styles.otpInput}
            disabled={isLoading}
            autoFocus={index === 0}
          />
        ))}
      </div>

      <div className={styles.resendSection}>
        {canResend ? (
          <button
            onClick={handleResend}
            className={styles.resendButton}
            disabled={isLoading}
          >
            Gửi lại mã
          </button>
        ) : (
          <p className={styles.countdown}>
            Gửi lại mã sau {countdown} giây
          </p>
        )}
      </div>

      {isLoading && <div className={styles.loading}>Đang xác thực...</div>}
    </div>
  );
}
