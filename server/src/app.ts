import express from "express";
import cors from "cors";
import userRoutes from "./routes/authRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import partnerRoutes from "./routes/partnerRoutes";
import adminUserRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/admin/adminRoutes";
import adminPartnerControllerRoutes from "./routes/admin/adminPartnerControllerRoutes";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

// Serve admin panel static files
app.use('/admin', express.static(path.join(__dirname, '../../admin_panel/dist')));

app.use(cookieParser())

// Middleware
app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5173"],
  credentials: true
}));

// CSP headers for admin pages
app.use('/admin', (_req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://localhost:3000;");
  next();
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1", serviceRoutes);
app.use("/api/v1", partnerRoutes);
app.use("/api/v1", adminUserRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin/partners", adminPartnerControllerRoutes);

// Email route
app.post("/api/v1/send-email", async (req, res) => {
  try {
    const { name, email, phone, service, question } = req.body;

    console.log("Email data received:", { name, email, phone, service, question });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

// Admin SPA route - serve React app for all admin routes
app.get(/^\/admin(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(__dirname, '../../admin_panel/dist/index.html'));
});

// Health check
app.get("/", (_req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});


export { app };