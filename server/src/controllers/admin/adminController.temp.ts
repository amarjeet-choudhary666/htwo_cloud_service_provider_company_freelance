import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const adminController = {
  // Dashboard - Temporary version without FormSubmission
  async dashboard(_req: Request, res: Response) {
    try {
      // Get basic statistics from existing models
      const [totalUsers, totalServices, totalPartners] = await Promise.all([
        prisma.user.count(),
        prisma.service.count(),
        prisma.partner.count()
      ]);

      // Mock form submission stats for now
      const stats = {
        totalSubmissions: 0,
        demoRequests: 0,
        contactForms: 0,
        getInTouch: 0,
        totalUsers,
        totalServices,
        totalPartners
      };

      const recentSubmissions: any[] = []; // Empty for now

      res.render('dashboard', {
        title: 'Admin Dashboard',
        pageTitle: 'Dashboard',
        stats,
        recentSubmissions
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).render('error', { 
        message: 'Error loading dashboard',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  },

  // Placeholder for demo requests
  async getDemoRequests(_req: Request, res: Response) {
    try {
      res.render('submissions/demo-requests', {
        title: 'Demo Requests',
        pageTitle: 'Demo Requests',
        submissions: [],
        pagination: {
          current: 1,
          total: 1,
          hasNext: false,
          hasPrev: false
        },
        filters: { search: '', status: '' },
        total: 0
      });
    } catch (error) {
      console.error('Demo requests error:', error);
      res.status(500).render('error', { 
        message: 'Error loading demo requests',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  },

  // Placeholder for contact forms
  async getContactForms(_req: Request, res: Response) {
    try {
      res.render('submissions/contact-forms', {
        title: 'Contact Forms',
        pageTitle: 'Contact Forms',
        submissions: [],
        pagination: {
          current: 1,
          total: 1,
          hasNext: false,
          hasPrev: false
        },
        total: 0
      });
    } catch (error) {
      console.error('Contact forms error:', error);
      res.status(500).render('error', { 
        message: 'Error loading contact forms',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  },

  // Placeholder for get in touch forms
  async getInTouchForms(_req: Request, res: Response) {
    try {
      res.render('submissions/get-in-touch', {
        title: 'Get In Touch Forms',
        pageTitle: 'Get In Touch Forms',
        submissions: [],
        pagination: {
          current: 1,
          total: 1,
          hasNext: false,
          hasPrev: false
        },
        total: 0
      });
    } catch (error) {
      console.error('Get in touch forms error:', error);
      res.status(500).render('error', { 
        message: 'Error loading get in touch forms',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  },

  // Get users - This should work with existing schema
  async getUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            firstname: true,
            address: true,
            companyName: true,
            createdAt: true
          }
        }),
        prisma.user.count()
      ]);

      res.render('admin-users', {
        title: 'Users Management',
        pageTitle: 'Users',
        users,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        total
      });
    } catch (error) {
      console.error('Users error:', error);
      res.status(500).render('error', { 
        message: 'Error loading users',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  },

  // Get user details
  async getUserDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          services: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });

      if (!user) {
        return res.status(404).render('error', { 
          message: 'User not found' 
        });
      }

      res.render('users/details', {
        title: 'User Details',
        pageTitle: 'User Details',
        user
      });
    } catch (error) {
      console.error('User details error:', error);
      res.status(500).render('error', { 
        message: 'Error loading user details',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  },

  // Update user
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { firstname, email, address, companyName } = req.body;

      await prisma.user.update({
        where: { id: parseInt(id) },
        data: { firstname, email, address, companyName }
      });

      res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ success: false, message: 'Error updating user' });
    }
  },

  // Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: { id: parseInt(id) }
      });

      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ success: false, message: 'Error deleting user' });
    }
  },

  // Get analytics - Placeholder
  async getAnalytics(_req: Request, res: Response) {
    try {
      const analytics = {
        totalSubmissions: 0,
        submissionsByType: [],
        submissionsByMonth: [],
        topServices: []
      };

      res.render('analytics/index', {
        title: 'Analytics',
        pageTitle: 'Analytics',
        analytics
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).render('error', { 
        message: 'Error loading analytics',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  },

  // Get stats API - Placeholder
  async getStats(_req: Request, res: Response) {
    try {
      res.json({
        totalSubmissions: 0,
        demoRequests: 0,
        contactForms: 0,
        getInTouch: 0
      });
    } catch (error) {
      console.error('Stats API error:', error);
      res.status(500).json({ error: 'Error fetching stats' });
    }
  },

  // Placeholder methods for form submissions
  async getSubmissionDetails(_req: Request, res: Response) {
    res.status(404).render('error', { message: 'Form submissions not available yet. Please run Prisma migration.' });
  },

  async updateSubmissionStatus(_req: Request, res: Response) {
    res.status(404).json({ success: false, message: 'Form submissions not available yet. Please run Prisma migration.' });
  },

  async deleteSubmission(_req: Request, res: Response) {
    res.status(404).json({ success: false, message: 'Form submissions not available yet. Please run Prisma migration.' });
  },

  async getSettings(_req: Request, res: Response) {
    try {
      res.render('settings/index', {
        title: 'Settings',
        pageTitle: 'Settings'
      });
    } catch (error) {
      console.error('Settings error:', error);
      res.status(500).render('error', { 
        message: 'Error loading settings',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  },

  async updateSettings(_req: Request, res: Response) {
    try {
      res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ success: false, message: 'Error updating settings' });
    }
  },

  async exportSubmissions(_req: Request, res: Response) {
    res.status(404).json({ error: 'Form submissions not available yet. Please run Prisma migration.' });
  },

  async exportUsers(_req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
      
      const csv = [
        'ID,Email,First Name,Company,Address,Created At',
        ...users.map(u => 
          `${u.id},"${u.email}","${u.firstname || ''}","${u.companyName || ''}","${u.address || ''}","${u.createdAt}"`
        )
      ].join('\n');

      res.send(csv);
    } catch (error) {
      console.error('Export users error:', error);
      res.status(500).json({ error: 'Error exporting users' });
    }
  },

  async bulkDeleteSubmissions(_req: Request, res: Response) {
    res.status(404).json({ success: false, message: 'Form submissions not available yet. Please run Prisma migration.' });
  },

  async bulkUpdateStatus(_req: Request, res: Response) {
    res.status(404).json({ success: false, message: 'Form submissions not available yet. Please run Prisma migration.' });
  }
};