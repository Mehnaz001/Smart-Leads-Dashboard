import { body, ValidationChain } from 'express-validator';

export const registerValidator: ValidationChain[] = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 chars'),
  body('email').trim().notEmpty().withMessage('Email required').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password required').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('role').optional().isIn(['admin', 'sales']).withMessage('Role must be admin or sales'),
];

export const loginValidator: ValidationChain[] = [
  body('email').trim().notEmpty().withMessage('Email required').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password required'),
];
