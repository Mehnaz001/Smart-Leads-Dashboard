import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { JwtPayload, UserRole } from '../types';

export const generateToken = (id: string, email: string, role: UserRole): string => {
  return jwt.sign({ id, email, role }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, jwtConfig.secret) as JwtPayload;
};
