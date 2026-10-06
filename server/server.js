import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { analyzeImage } from "./ai.js";

import {
  authenticateToken,
  requireAdmin,
} from "./authMiddleware.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
});

// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
  res.send("🌊 RiverEye API is running!");
});

// ==========================================
// GET ALL REPORTS
// ==========================================

app.get("/api/reports", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reports ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Reports error:", error);

    res.status(500).json({
      message: "Database Error",
    });
  }
});

// ==========================================
// CREATE REPORT
// ==========================================

app.post(
  "/api/reports",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        river,
        location,
        description,
        latitude,
        longitude,
      } = req.body;

      let imageUrl = null;

      // Upload image to Cloudinary
      if (req.file) {
        const result = await new Promise(
          (resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder: "rivereye/reports",
                },
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                }
              )
              .end(req.file.buffer);
          }
        );

        imageUrl = result.secure_url;
      }

      // Save report
      const result = await pool.query(
        `INSERT INTO reports
        (
          name,
          river,
          location,
          description,
          image,
          latitude,
          longitude,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending')
        RETURNING *`,
        [
          name,
          river,
          location,
          description,
          imageUrl,
          latitude || null,
          longitude || null,
        ]
      );

      res.status(201).json({
        message: "Report submitted successfully!",
        report: result.rows[0],
      });
    } catch (error) {
      console.error("Report error:", error);

      res.status(500).json({
        message: "Failed to submit report",
      });
    }
  }
);

// ==========================================
// REGISTER
// ==========================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
      (name, email, password, role)
      VALUES ($1, $2, $3, 'user')
      RETURNING id, name, email, role`,
      [
        name,
        email,
        hashedPassword,
      ]
    );

    res.status(201).json({
      message: "Registration successful",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});

// ==========================================
// LOGIN
// ==========================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// ==========================================
// AI TEST
// ==========================================

app.post(
  "/api/ai-test",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log(
        "🤖 AI test request received"
      );

      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded",
        });
      }

      console.log(
        "📷 Image received:",
        req.file.originalname
      );

      const result =
        await analyzeImage(
          req.file.buffer,
          req.file.mimetype
        );

      console.log(
        "🤖 AI Result:",
        result
      );

      res.json({
        success: true,
        result,
      });
    } catch (error) {
      console.error(
        "❌ AI Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ==========================================
// VERIFY REPORT - ADMIN ONLY
// ==========================================

app.put(
  "/api/reports/:id/verify",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      console.log(
        "Verifying report:",
        id
      );

      const result = await pool.query(
        `UPDATE reports
         SET status = 'Verified'
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Report not found",
        });
      }

      res.json({
        message:
          "Report verified successfully!",
        report: result.rows[0],
      });
    } catch (error) {
      console.error(
        "Verify error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to verify report",
      });
    }
  }
);

// ==========================================
// REJECT REPORT - ADMIN ONLY
// ==========================================

app.put(
  "/api/reports/:id/reject",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      console.log(
        "Rejecting report:",
        id
      );

      const result = await pool.query(
        `UPDATE reports
         SET status = 'Rejected'
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Report not found",
        });
      }

      res.json({
        message:
          "Report rejected successfully!",
        report: result.rows[0],
      });
    } catch (error) {
      console.error(
        "Reject error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to reject report",
      });
    }
  }
);

// ==========================================
// START SERVER
// ==========================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `🚀 Server running on https://rivereye.onrender.com`
    );
  }
);