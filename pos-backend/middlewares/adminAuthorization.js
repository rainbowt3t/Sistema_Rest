const createHttpError = require("http-errors");

const isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "Admin") {
      const error = createHttpError(403, "Access denied. Admin role required.");
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isAdmin };
