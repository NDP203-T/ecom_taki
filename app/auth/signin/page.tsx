'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', formData);
  };

  const handleOAuthLogin = (provider: 'google' | 'facebook') => {
    console.log('OAuth login:', provider);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-black px-4 py-12">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-10">
          <div className="inline-block mb-6">
            <svg
              className="w-12 h-12 text-gray-900 dark:text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h1 className="text-[32px] font-semibold text-gray-900 dark:text-white leading-tight tracking-tight mb-2">
            Đăng nhập
          </h1>
          <p className="text-[17px] text-gray-600 dark:text-gray-400">
            để tiếp tục với Ecom Taki
          </p>
        </div>

        <div className="bg-white dark:bg-[#1d1d1f] rounded-[18px] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="border-b border-gray-200 dark:border-gray-800">
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-6 py-4 text-[17px] bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none"
                placeholder="Email"
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-6 py-4 pr-12 text-[17px] bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none"
                placeholder="Mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4 text-right">
          <Link
            href="/auth/forgot-password"
            className="text-[14px] text-[#06c] dark:text-[#2997ff] hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[17px] font-medium py-[14px] rounded-[12px] transition-all duration-200 shadow-sm"
        >
          Tiếp tục
        </button>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#1d1d1f] hover:bg-gray-50 dark:hover:bg-[#2d2d2f] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-[17px] font-medium py-[14px] rounded-[12px] transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            Tiếp tục với Google
          </button>

          <button
            onClick={() => handleOAuthLogin('facebook')}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#1d1d1f] hover:bg-gray-50 dark:hover:bg-[#2d2d2f] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-[17px] font-medium py-[14px] rounded-[12px] transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Tiếp tục với Facebook
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[14px] text-gray-600 dark:text-gray-400">
            Chưa có tài khoản?{' '}
            <Link
              href="/auth/signup"
              className="text-[#06c] dark:text-[#2997ff] hover:underline"
            >
              Tạo tài khoản
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center text-[12px] text-gray-500 dark:text-gray-600">
          <p>
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <Link href="/terms" className="hover:underline">
              Điều khoản
            </Link>{' '}
            và{' '}
            <Link href="/privacy" className="hover:underline">
              Chính sách bảo mật
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
