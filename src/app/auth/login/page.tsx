'use client';

import { useState } from 'react';
import Link from 'next/link';
import { callLogin } from '@/services/AuthService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  interface LoginFormData {
    email: string;
    password: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const res = await callLogin(email, password);
      if(res.data.code == 1000) {
        const accessToken = res.data.result?.access_token;
        if (accessToken) {
              localStorage.setItem('access_token', accessToken);
        }

        window.location.href = '/admin/dashboard';
      }

    } catch (err: any) {
      setErrorMsg('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-green-200">
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-2 tracking-wide">
          VShare
        </h1>
        <p className="text-center text-green-600 font-medium mb-6">
          Đăng nhập hệ thống quản trị
        </p>
        {errorMsg && (
          <div className="mb-4 text-red-600 text-center font-semibold">{errorMsg}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-green-800 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ email"
              required
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 text-green-900"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-green-800 mb-1">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 text-green-900"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-3 rounded-md font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-green-700">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-green-700 hover:text-green-900 font-semibold underline">
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;