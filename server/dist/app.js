"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const partnerRoutes_1 = __importDefault(require("./routes/partnerRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/admin/adminRoutes"));
const adminPartnerControllerRoutes_1 = __importDefault(require("./routes/admin/adminPartnerControllerRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
exports.app = app;
// Serve admin panel static files
app.use('/admin', express_1.default.static(path_1.default.join(__dirname, '../../admin_panel/dist')));
app.use((0, cookie_parser_1.default)());
// Middleware
app.use((0, cors_1.default)({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true
}));
// CSP headers for admin pages
app.use('/admin', (_req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://localhost:3000;");
    next();
});
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
// Routes
app.use("/api/v1/users", authRoutes_1.default);
app.use("/api/v1", serviceRoutes_1.default);
app.use("/api/v1", partnerRoutes_1.default);
app.use("/api/v1", userRoutes_1.default);
app.use("/api/v1/admin", adminRoutes_1.default);
app.use("/api/v1/admin/partners", adminPartnerControllerRoutes_1.default);
// Email route
app.post("/api/v1/send-email", async (req, res) => {
    try {
        const { name, email, phone, service, question } = req.body;
        console.log("Email data received:", { name, email, phone, service, question });
        res.status(200).json({ message: "Email sent successfully" });
    }
    catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ message: "Failed to send email" });
    }
});
// Admin SPA route - serve React app for all admin routes
app.get(/^\/admin(?:\/.*)?$/, (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../admin_panel/dist/index.html'));
});
// Health check
app.get("/", (_req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});
//# sourceMappingURL=app.js.map