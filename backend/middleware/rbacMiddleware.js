const jwt = require("jsonwebtoken");

// Role hierarchy - higher roles inherit lower role permissions
const roleHierarchy = {
  Owner: ["Owner", "Admin", "Manager", "Member", "Viewer"],
  Admin: ["Admin", "Manager", "Member", "Viewer"],
  Manager: ["Manager", "Member", "Viewer"],
  Member: ["Member", "Viewer"],
  Viewer: ["Viewer"]
};

// Permission definitions
const permissions = {
  // User management
  "user:invite": ["Owner", "Admin", "Manager"],
  "user:remove": ["Owner", "Admin"],
  "user:update": ["Owner", "Admin", "Manager"],
  "user:view": ["Owner", "Admin", "Manager", "Member", "Viewer"],
  
  // Role management
  "role:assign": ["Owner", "Admin"],
  "role:view": ["Owner", "Admin"],
  
  // Billing & Subscription
  "billing:view": ["Owner", "Admin"],
  "billing:manage": ["Owner", "Admin"],
  "subscription:upgrade": ["Owner", "Admin"],
  "subscription:view": ["Owner", "Admin", "Manager"],
  
  // Analytics
  "analytics:view": ["Owner", "Admin", "Manager"],
  "analytics:export": ["Owner", "Admin"],
  
  // Notes
  "notes:create": ["Owner", "Admin", "Manager", "Member"],
  "notes:edit": ["Owner", "Admin", "Manager", "Member"],
  "notes:delete": ["Owner", "Admin", "Manager"],
  "notes:view": ["Owner", "Admin", "Manager", "Member", "Viewer"],
  
  // Settings
  "settings:view": ["Owner", "Admin", "Manager"],
  "settings:manage": ["Owner", "Admin"],
  
  // Tenant
  "tenant:view": ["Owner", "Admin", "Manager", "Member", "Viewer"],
  "tenant:manage": ["Owner", "Admin"]
};

// Middleware factory for checking permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey123");
      const userRole = decoded.role;
      
      // Check if user role has the required permission
      const allowedRoles = permissions[permission];
      
      if (!allowedRoles) {
        return res.status(500).json({ message: "Permission not defined" });
      }
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          message: "You don't have permission to perform this action" 
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

// Middleware for checking role
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey123");
      const userRole = decoded.role;
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          message: "You don't have the required role" 
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

// Middleware to check if user belongs to tenant
const checkTenant = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey123");
    const tenantId = req.params.tenantId || req.body.tenantId;
    
    if (tenantId && decoded.tenantId !== tenantId) {
      return res.status(403).json({ message: "Access denied to this tenant" });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  checkPermission,
  checkRole,
  checkTenant,
  permissions,
  roleHierarchy
};
