import { body, query, ValidationChain } from 'express-validator';

export const createLeadValidator: ValidationChain[] = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').trim().notEmpty().withMessage('Email required').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  body('source').notEmpty().withMessage('Source is required').isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes max 500 chars'),
];

export const updateLeadValidator: ValidationChain[] = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('email').optional().trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  body('source').optional().isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes max 500 chars'),
];

export const leadQueryValidator: ValidationChain[] = [
  query('status').optional({ checkFalsy: true }).isIn(['New', 'Contacted', 'Qualified', 'Lost']),
  query('source').optional({ checkFalsy: true }).isIn(['Website', 'Instagram', 'Referral']),
  query('sort').optional({ checkFalsy: true }).isIn(['latest', 'oldest']),
  query('page').optional({ checkFalsy: true }).isInt({ min: 1 }).toInt(),
  query('limit').optional({ checkFalsy: true }).isInt({ min: 1, max: 100 }).toInt(),
];
