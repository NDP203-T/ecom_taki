'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { googleLoginRequest } from '@/lib/store/slices/authSlice';
import LoginForm from '@/app/components/Auth/LoginForm';
import styles from './signin.module.css';

function SignInContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    
    if (credentialResponse.credential) {
      // Kiểm tra token format
      const token = credentialResponse.credential;
      const parts = token.split('.');
      dispatch(googleLoginRequest({ token: credentialResponse.credential }));
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  const triggerGoogleLogin = () => {
    // Tìm button Google thật và click vào nó
    const googleButton = googleButtonRef.current?.querySelector('div[role="button"]') as HTMLElement;
    if (googleButton) {
      googleButton.click();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <svg
              className={styles.logoIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h1 className={styles.title}>Đăng nhập</h1>
          <p className={styles.subtitle}>để tiếp tục với Ecom Taki</p>
        </div>

        <div className={styles.formCard}>
          <LoginForm />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.forgotPassword}>
          <Link href="/auth/forgot-password" className={styles.link}>
            Quên mật khẩu?
          </Link>
        </div>

        <div className={styles.divider}>
          <span>Hoặc đăng nhập với</span>
        </div>

        {/* Hidden Google button */}
        <div ref={googleButtonRef} style={{ display: 'none' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            type="standard"
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
            logo_alignment="left"
          />
        </div>

        <div className={styles.oauthButtons}>
          <button 
            className={styles.oauthButton}
            onClick={triggerGoogleLogin}
            disabled={isLoading}
          >
            <svg className={styles.oauthIcon} viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>{isLoading ? 'Đang xử lý...' : 'Tiếp tục với Google'}</span>
          </button>

          <button className={styles.oauthButton} disabled={isLoading}>
            <svg
              className={styles.oauthIcon}
              fill="#1877F2"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Tiếp tục với Facebook</span>
          </button>
        </div>

        <div className={styles.footer}>
          <p>
            Chưa có tài khoản?{' '}
            <Link href="/auth/signup" className={styles.link}>
              Tạo tài khoản
            </Link>
          </p>
        </div>

        <div className={styles.terms}>
          <p>
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <Link href="/terms" className={styles.termsLink}>
              Điều khoản
            </Link>{' '}
            và{' '}
            <Link href="/privacy" className={styles.termsLink}>
              Chính sách bảo mật
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <SignInContent />
    </GoogleOAuthProvider>
  );
}
