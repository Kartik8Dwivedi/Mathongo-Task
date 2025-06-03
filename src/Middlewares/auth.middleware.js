export const isAdmin = (req, res, next) => {
  // You can replace this logic with real auth later
  const isAdminUser = req.headers["x-admin"] === "true";

  if (!isAdminUser) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }

  next();
};
