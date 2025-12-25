import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/auth';
import api from '@/lib/api';

const registerSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email('有効なメールアドレスを入力してください'),
    password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        name: data.name,
      });
      const { user, tokens } = response.data;
      setAuth(user, tokens.accessToken, tokens.refreshToken);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">Kotsutsumi</h1>
          <p className="mt-2 text-gray-600">365日作業ログ</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">新規登録</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="label">
                名前（任意）
              </label>
              <input
                id="name"
                type="text"
                className="input"
                placeholder="山田 太郎"
                {...register('name')}
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="email@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                パスワード（確認）
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="input"
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
              {isLoading ? '登録中...' : '登録'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            すでにアカウントをお持ちの方は{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
