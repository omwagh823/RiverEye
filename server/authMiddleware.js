import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    const token = parts[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (error, user) => {
        if (error) {
          console.error("JWT error:", error);

          return res.status(403).json({
            message: "Invalid or expired token",
          });
        }

        req.user = user;

        console.log("Authenticated user:", user);

        next();
      }
    );
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(500).json({
      message: "Authentication failed",
    });
  }
};

export const requireAdmin = (req, res, next) => {
  console.log("Checking admin role:", req.user?.role);

  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};