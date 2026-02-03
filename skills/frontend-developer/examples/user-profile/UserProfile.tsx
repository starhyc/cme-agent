import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserProfileProps {
  userId: string;
}

/**
 * 用户资料组件
 * 展示用户信息，处理加载、错误和空状态
 */
export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('加载失败');

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  // 空状态
  if (!user) {
    return (
      <div className="text-center text-gray-500 py-8">
        未找到用户信息
      </div>
    );
  }

  // 数据展示
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt={user.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
          loading="lazy"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
    </div>
  );
};
