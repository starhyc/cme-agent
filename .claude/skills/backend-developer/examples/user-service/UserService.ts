import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { logger } from '../utils/logger';

/**
 * 用户服务类
 * 处理用户相关的业务逻辑
 */
export class UserService {
  constructor(private userRepository: UserRepository) {}

  /**
   * 根据ID获取用户
   * @param userId 用户ID
   * @returns 用户对象，不存在则返回null
   * @throws Error 数据库查询失败时抛出异常
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      logger.info('获取用户信息', { userId });

      const user = await this.userRepository.findById(userId);

      if (!user) {
        logger.warn('用户不存在', { userId });
        return null;
      }

      logger.info('用户信息获取成功', { userId });
      return user;
    } catch (error) {
      logger.error('获取用户信息失败', { userId, error });
      throw new Error('获取用户信息失败');
    }
  }

  /**
   * 创建新用户
   * @param userData 用户数据
   * @returns 创建的用户对象
   * @throws Error 用户已存在或创建失败时抛出异常
   */
  async createUser(userData: { name: string; email: string }): Promise<User> {
    try {
      logger.info('创建用户', { email: userData.email });

      // 检查邮箱是否已存在
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        logger.warn('用户邮箱已存在', { email: userData.email });
        throw new Error('用户邮箱已存在');
      }

      // 创建用户
      const user = await this.userRepository.create(userData);

      logger.info('用户创建成功', { userId: user.id, email: user.email });
      return user;
    } catch (error) {
      logger.error('创建用户失败', { email: userData.email, error });
      throw error;
    }
  }

  /**
   * 更新用户信息
   * @param userId 用户ID
   * @param updates 更新的字段
   * @returns 更新后的用户对象
   * @throws Error 用户不存在或更新失败时抛出异常
   */
  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    try {
      logger.info('更新用户信息', { userId, updates });

      // 检查用户是否存在
      const user = await this.userRepository.findById(userId);
      if (!user) {
        logger.warn('用户不存在', { userId });
        throw new Error('用户不存在');
      }

      // 更新用户
      const updatedUser = await this.userRepository.update(userId, updates);

      logger.info('用户信息更新成功', { userId });
      return updatedUser;
    } catch (error) {
      logger.error('更新用户信息失败', { userId, error });
      throw error;
    }
  }
}
