const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("\n=== Auth Middleware Called ===");
  console.log("URL:", req.method, req.originalUrl);
  console.log("Full auth header:", req.headers.authorization);
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    console.log("ERROR: No authorization header!");
    return res.status(401).json({ message: "Access denied. No token." });
  }

  // Extract token - handle both "Bearer token" and plain "token" formats
  let token = authHeader;
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7).trim();
  }
  
  console.log("Extracted token:", token);
  console.log("JWT Secret:", process.env.JWT_SECRET ? "SET" : "NOT SET (using default)");
  const secret = process.env.JWT_SECRET || "secretkey123";

  try {
    const decoded = jwt.verify(token, secret);
    console.log("Token decoded successfully! User:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("ERROR: Token verification FAILED:", err.message);
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;
