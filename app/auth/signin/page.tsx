'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    console.log('=== DEBUG GOOGLE TOKEN ===');
    console.log('Full response:', credentialResponse);
    console.log('Credential:', credentialResponse.credential);
    console.log('Token length:', credentialResponse.credential?.length);
    console.log('Token preview:', credentialResponse.credential?.substring(0, 50));
    
    if (credentialResponse.credential) {
      // Kiểm tra token format
      const token = credentialResponse.credential;
      const parts = token.split('.');
      console.log('Token parts:', parts.length);
      console.log('Starts with eyJ:', token.startsWith('eyJ'));
      
      dispatch(googleLoginRequest({ token: credentialResponse.credential }));
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
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

        <div className={styles.oauthButtons}>
          <div className={styles.googleButtonWrapper}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              type="standard"
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              logo_alignment="left"
              width="100%"
            />
          </div>

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
