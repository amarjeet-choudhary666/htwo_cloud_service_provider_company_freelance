"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.adminController = {
    // Dashboard
    async dashboard(_req, res) {
        try {
            // Get statistics
            const [totalSubmissions, demoRequests, contactForms, getInTouch, recentSubmissions] = await Promise.all([
                prisma.formSubmission.count(),
                prisma.formSubmission.count({ where: { type: 'demo' } }),
                prisma.formSubmission.count({ where: { type: 'contact' } }),
                prisma.formSubmission.count({ where: { type: 'get_in_touch' } }),
                prisma.formSubmission.findMany({
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: { id: true, email: true, firstname: true }
                        }
                    }
                })
            ]);
            const stats = {
                totalSubmissions,
                demoRequests,
                contactForms,
                getInTouch
            };
            res.render('dashboard', {
                title: 'Admin Dashboard',
                pageTitle: 'Dashboard',
                stats,
                recentSubmissions
            });
        }
        catch (error) {
            console.error('Dashboard error:', error);
            res.status(500).render('error', {
                message: 'Error loading dashboard',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },
    // Get Demo Requests
    async getDemoRequests(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const search = req.query.search || '';
            const status = req.query.status || '';
            const where = { type: 'demo' };
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } }
                ];
            }
            if (status) {
                where.status = status;
            }
            const [submissions, total] = await Promise.all([
                prisma.formSubmission.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: { id: true, email: true, firstname: true }
                        }
                    }
                }),
                prisma.formSubmission.count({ where })
            ]);
            const totalPages = Math.ceil(total / limit);
            res.render('submissions/demo-requests', {
                title: 'Demo Requests',
                pageTitle: 'Demo Requests',
                submissions,
                pagination: {
                    current: page,
                    total: totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                },
                filters: { search, status },
                total
            });
        }
        catch (error) {
            console.error('Demo requests error:', error);
            res.status(500).render('error', {
                message: 'Error loading demo requests',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },
    // Get Contact Forms
    async getContactForms(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const search = req.query.search || '';
            const where = { type: 'contact' };
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ];
            }
            const [submissions, total] = await Promise.all([
                prisma.formSubmission.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.formSubmission.count({ where })
            ]);
            res.render('submissions/contact-forms', {
                title: 'Contact Forms',
                pageTitle: 'Contact Forms',
                submissions,
                pagination: {
                    current: page,
                    total: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                },
                total
            });
        }
        catch (error) {
            console.error('Contact forms error:', error);
            res.status(500).render('error', {
                message: 'Error loading contact forms',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },
    // Get In Touch Forms
    async getInTouchForms(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const [submissions, total] = await Promise.all([
                prisma.formSubmission.findMany({
                    where: { type: 'get_in_touch' },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.formSubmission.count({ where: { type: 'get_in_touch' } })
            ]);
            res.render('submissions/get-in-touch', {
                title: 'Get In Touch Forms',
                pageTitle: 'Get In Touch Forms',
                submissions,
                pagination: {
                    current: page,
                    total: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                },
                total
            });
        }
        catch (error) {
            console.error('Get in touch forms error:', error);
            res.status(500).render('error', {
                message: 'Error loading get in touch forms',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },
    // Get submission details
    async getSubmissionDetails(req, res) {
        try {
            const { id } = req.params;
            const submission = await prisma.formSubmission.findUnique({
                where: { id },
                include: {
                    user: {
                        select: { id: true, email: true, firstname: true, createdAt: true }
                    }
                }
            });
            if (!submission) {
                return res.status(404).render('error', {
                    message: 'Submission not found'
                });
            }
            res.render('submissions/details', {
                title: 'Submission Details',
                pageTitle: 'Submission Details',
                submission
            });
        }
        catch (error) {
            console.error('Submission details error:', error);
            res.status(500).render('error', {
                message: 'Error loading submission details',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },
    // Update submission status
    async updateSubmissionStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await prisma.formSubmission.update({
                where: { id },
                data: { status }
            });
            res.json({ success: true, message: 'Status updated successfully' });
        }
        catch (error) {
            console.error('Update status error:', error);
            res.status(500).json({ success: false, message: 'Error updating status' });
        }
    },
    // Delete submission
    async deleteSubmission(req, res) {
        try {
            const { id } = req.params;
            await prisma.formSubmission.delete({
                where: { id }
            });
            res.json({ success: true, message: 'Submission deleted successfully' });
        }
        catch (error) {
            console.error('Delete submission error:', error);
            res.status(500).json({ success: false, message: 'Error deleting submission' });
        }
    },
    // Get users
    async getUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
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
                        createdAt: true,
                        _count: {
                            select: { formSubmissions: true }
                        }
                    }
                }),
                prisma.user.count()
            ]);
            res.render('users/index', {
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
        }
        catch (error) {
            console.error('Users error:', error);
            res.status(500).render('error', {
                message: 'Error loading users',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },
    // Get user details
    async getUserDetails(req, res) {
        try {
            const { id } = req.params;
            const user = await prisma.user.findUnique({
                where: { id: parseInt(id) },
                include: {
                    formSubmissions: {
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
        }
        catch (error) {
            console.error('User details error:', error);
            res.status(500).render('error', {
                message: 'Error loading user details',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },
    // Update user
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { firstname, email, address, companyName } = req.body;
            await prisma.user.update({
                where: { id: parseInt(id) },
                data: { firstname, email, address, companyName }
            });
            res.json({ success: true, message: 'User updated successfully' });
        }
        catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({ success: false, message: 'Error updating user' });
        }
    },
    // Delete user
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await prisma.user.delete({
                where: { id: parseInt(id) }
            });
            res.json({ success: true, message: 'User deleted successfully' });
        }
        catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ success: false, message: 'Error deleting user' });
        }
    },
    // Get analytics
    async getAnalytics(_req, res) {
        try {
            // Get analytics data
            const [totalSubmissions, submissionsByType, submissionsByMonth, topServices] = await Promise.all([
                prisma.formSubmission.count(),
                prisma.formSubmission.groupBy({
                    by: ['type'],
                    _count: { type: true }
                }),
                prisma.formSubmission.groupBy({
                    by: ['createdAt'],
                    _count: { createdAt: true },
                    orderBy: { createdAt: 'asc' }
                }),
                prisma.formSubmission.groupBy({
                    by: ['service'],
                    _count: { service: true },
                    orderBy: { _count: { service: 'desc' } },
                    take: 5,
                    where: {
                        service: {
                            not: null
                        }
                    }
                })
            ]);
            res.render('analytics/index', {
                title: 'Analytics',
                pageTitle: 'Analytics',
                analytics: {
                    totalSubmissions,
                    submissionsByType,
                    submissionsByMonth,
                    topServices
                }
            });
        }
        catch (error) {
            console.error('Analytics error:', error);
            res.status(500).render('error', {
                message: 'Error loading analytics',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },
    // Get stats API
    async getStats(_req, res) {
        try {
            const [totalSubmissions, demoRequests, contactForms, getInTouch] = await Promise.all([
                prisma.formSubmission.count(),
                prisma.formSubmission.count({ where: { type: 'demo' } }),
                prisma.formSubmission.count({ where: { type: 'contact' } }),
                prisma.formSubmission.count({ where: { type: 'get_in_touch' } })
            ]);
            res.json({
                totalSubmissions,
                demoRequests,
                contactForms,
                getInTouch
            });
        }
        catch (error) {
            console.error('Stats API error:', error);
            res.status(500).json({ error: 'Error fetching stats' });
        }
    },
    // Get settings
    async getSettings(_req, res) {
        try {
            res.render('settings/index', {
                title: 'Settings',
                pageTitle: 'Settings'
            });
        }
        catch (error) {
            console.error('Settings error:', error);
            res.status(500).render('error', {
                message: 'Error loading settings',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    },
    // Update settings
    async updateSettings(_req, res) {
        try {
            // Implement settings update logic
            res.json({ success: true, message: 'Settings updated successfully' });
        }
        catch (error) {
            console.error('Update settings error:', error);
            res.status(500).json({ success: false, message: 'Error updating settings' });
        }
    },
    // Export submissions
    async exportSubmissions(_req, res) {
        try {
            const submissions = await prisma.formSubmission.findMany({
                orderBy: { createdAt: 'desc' }
            });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=submissions.csv');
            // Convert to CSV format
            const csv = [
                'ID,Name,Email,Phone,Type,Service,Message,Created At',
                ...submissions.map(s => `${s.id},"${s.name}","${s.email}","${s.phone || ''}","${s.type}","${s.service || ''}","${s.message || ''}","${s.createdAt}"`)
            ].join('\n');
            res.send(csv);
        }
        catch (error) {
            console.error('Export submissions error:', error);
            res.status(500).json({ error: 'Error exporting submissions' });
        }
    },
    // Export users
    async exportUsers(_req, res) {
        try {
            const users = await prisma.user.findMany({
                orderBy: { createdAt: 'desc' }
            });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
            // Convert to CSV format
            const csv = [
                'ID,Email,First Name,Company,Address,Created At',
                ...users.map(u => `${u.id},"${u.email}","${u.firstname || ''}","${u.companyName || ''}","${u.address || ''}","${u.createdAt}"`)
            ].join('\n');
            res.send(csv);
        }
        catch (error) {
            console.error('Export users error:', error);
            res.status(500).json({ error: 'Error exporting users' });
        }
    },
    // Bulk delete submissions
    async bulkDeleteSubmissions(req, res) {
        try {
            const { ids } = req.body;
            await prisma.formSubmission.deleteMany({
                where: { id: { in: ids } }
            });
            res.json({ success: true, message: 'Submissions deleted successfully' });
        }
        catch (error) {
            console.error('Bulk delete error:', error);
            res.status(500).json({ success: false, message: 'Error deleting submissions' });
        }
    },
    // Bulk update status
    async bulkUpdateStatus(req, res) {
        try {
            const { ids, status } = req.body;
            await prisma.formSubmission.updateMany({
                where: { id: { in: ids } },
                data: { status }
            });
            res.json({ success: true, message: 'Status updated successfully' });
        }
        catch (error) {
            console.error('Bulk update error:', error);
            res.status(500).json({ success: false, message: 'Error updating status' });
        }
    }
};
//# sourceMappingURL=adminController.js.map