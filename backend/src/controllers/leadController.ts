import { Response } from 'express';
import { Lead } from '../models/Lead';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest, LeadStatus, LeadSource, PaginationMeta } from '../types';
import { Parser } from 'json2csv';

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = 1,
      limit = 10,
    } = req.query as {
      status?: LeadStatus;
      source?: LeadSource;
      search?: string;
      sort?: 'latest' | 'oldest';
      page?: number;
      limit?: number;
    };

    const query: Record<string, unknown> = {};

    if (status) query.status = status;
    if (source) query.source = source;

    // Role-based: sales users only see their own leads
    if (req.user?.role === 'sales') {
      query.createdBy = req.user.id;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(query),
    ]);

    const meta: PaginationMeta = {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    };

    sendSuccess(res, 'Leads retrieved successfully', leads, 200, meta);
  } catch {
    sendError(res, 'Failed to retrieve leads', 500);
  }
};

export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales users can only view their own leads
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      sendError(res, 'Access denied', 403);
      return;
    }

    sendSuccess(res, 'Lead retrieved successfully', lead);
  } catch {
    sendError(res, 'Failed to retrieve lead', 500);
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user?.id,
    });

    await lead.populate('createdBy', 'name email');
    sendSuccess(res, 'Lead created successfully', lead, 201);
  } catch (error) {
    sendError(res, 'Failed to create lead', 500);
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales users can only update their own leads
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      sendError(res, 'Access denied', 403);
      return;
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email').populate('assignedTo', 'name email');

    sendSuccess(res, 'Lead updated successfully', updated);
  } catch {
    sendError(res, 'Failed to update lead', 500);
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Only admin can delete leads
    if (req.user?.role !== 'admin') {
      sendError(res, 'Only admins can delete leads', 403);
      return;
    }

    await Lead.findByIdAndDelete(req.params.id);
    sendSuccess(res, 'Lead deleted successfully');
  } catch {
    sendError(res, 'Failed to delete lead', 500);
  }
};

export const exportLeadsCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: Record<string, unknown> = {};
    if (req.user?.role === 'sales') {
      query.createdBy = req.user.id;
    }

    const leads = await Lead.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    const csvData = leads.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Status: lead.status,
      Source: lead.source,
      Notes: lead.notes || '',
      'Created At': lead.createdAt,
    }));

    const parser = new Parser({ fields: ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'] });
    const csv = parser.parse(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch {
    sendError(res, 'Failed to export leads', 500);
  }
};

export const getLeadStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: Record<string, unknown> = {};
    if (req.user?.role === 'sales') query.createdBy = req.user.id;

    const [statusStats, sourceStats, total] = await Promise.all([
      Lead.aggregate([
        { $match: query },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: query },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(query),
    ]);

    sendSuccess(res, 'Stats retrieved successfully', { statusStats, sourceStats, total });
  } catch {
    sendError(res, 'Failed to retrieve stats', 500);
  }
};
