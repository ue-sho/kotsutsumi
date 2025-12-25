import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import api from '@/lib/api';

const profileSchema = z.object({
  name: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
    newPassword: z.string().min(8, '新しいパスワードは8文字以上で入力してください'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function SettingsPage() {
  const queryClient = useQueryClient();
  const { user, setAuth, accessToken, refreshToken } = useAuthStore();
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/profile');
      return response.data;
    },
  });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: profile?.name || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const profileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await api.patch('/profile', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      if (user && accessToken && refreshToken) {
        setAuth({ ...user, name: data.name }, accessToken, refreshToken);
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      await api.patch('/profile/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      resetPassword();
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    profileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    passwordMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="mt-1 text-gray-600">アカウント設定を管理できます</p>
      </div>

      {/* Profile settings */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">プロフィール</h2>

        {profileSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            プロフィールを更新しました
          </div>
        )}

        {profileMutation.isError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            更新に失敗しました
          </div>
        )}

        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="label">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              className="input bg-gray-50"
              value={profile?.email || ''}
              disabled
            />
            <p className="mt-1 text-sm text-gray-500">メールアドレスは変更できません</p>
          </div>

          <div>
            <label htmlFor="name" className="label">
              名前
            </label>
            <input
              id="name"
              type="text"
              className="input"
              placeholder="山田 太郎"
              {...registerProfile('name')}
            />
            {profileErrors.name && (
              <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn-primary"
              disabled={profileMutation.isPending}
            >
              {profileMutation.isPending ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>

      {/* Password settings */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">パスワード変更</h2>

        {passwordSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            パスワードを変更しました
          </div>
        )}

        {passwordMutation.isError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            パスワード変更に失敗しました
          </div>
        )}

        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="label">
              現在のパスワード
            </label>
            <input
              id="currentPassword"
              type="password"
              className="input"
              placeholder="••••••••"
              {...registerPassword('currentPassword')}
            />
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">
                {passwordErrors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="label">
              新しいパスワード
            </label>
            <input
              id="newPassword"
              type="password"
              className="input"
              placeholder="••••••••"
              {...registerPassword('newPassword')}
            />
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label">
              新しいパスワード（確認）
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input"
              placeholder="••••••••"
              {...registerPassword('confirmPassword')}
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {passwordErrors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn-primary"
              disabled={passwordMutation.isPending}
            >
              {passwordMutation.isPending ? '変更中...' : 'パスワードを変更'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
