import { Router } from 'express';
import {
  getLeads, getLeadById, createLead, updateLead, deleteLead, exportLeadsCSV, getLeadStats
} from '../controllers/leadController';
import { createLeadValidator, updateLeadValidator, leadQueryValidator } from '../validators/lead';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/export', exportLeadsCSV);
router.get('/stats', getLeadStats);
router.get('/', leadQueryValidator, validate, getLeads);
router.get('/:id', getLeadById);
router.post('/', createLeadValidator, validate, createLead);
router.put('/:id', updateLeadValidator, validate, updateLead);
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
