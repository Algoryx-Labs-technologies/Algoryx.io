import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '@/config/env';
import { AppError } from '@/types';
import { secureCompare } from '@/utils/secureCompare';

export interface AdminLoginInput {
  adminId: string;
  password: string;
  mpin: string;
}

export interface AdminTokenPayload {
  sub: string;
  role: 'admin';
}

export interface AdminSession {
  token: string;
  expiresIn: string;
  admin: {
    id: string;
    role: 'admin';
  };
}

export function loginAdmin(input: AdminLoginInput): AdminSession {
  const idMatch = secureCompare(input.adminId, env.ADMIN_ID);
  const passwordMatch = secureCompare(input.password, env.ADMIN_PASSWORD);
  const mpinMatch = secureCompare(input.mpin, env.ADMIN_MPIN);

  if (!idMatch || !passwordMatch || !mpinMatch) {
    throw new AppError(401, 'Invalid admin credentials');
  }

  const payload: AdminTokenPayload = {
    sub: env.ADMIN_ID,
    role: 'admin',
  };

  const signOptions: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  const token = jwt.sign(payload, env.JWT_SECRET, signOptions);

  return {
    token,
    expiresIn: env.JWT_EXPIRES_IN,
    admin: {
      id: env.ADMIN_ID,
      role: 'admin',
    },
  };
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AdminTokenPayload;
    if (decoded.role !== 'admin') {
      throw new AppError(401, 'Invalid token');
    }
    return decoded;
  } catch {
    throw new AppError(401, 'Invalid or expired token');
  }
}
