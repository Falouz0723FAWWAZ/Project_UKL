export const IsAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      auth: false,
      message: "Pengguna tidak terautentikasi",
    });
  }

  const userRole = req.user.role;
  if (userRole === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      auth: false,
      message: "Anda bukan admin",
    });
  }
};

export const IsMember = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      auth: false,
      message: "Pengguna tidak terautentikasi",
    });
  }

  const userRole = req.user.role;
  if (userRole === "member") {
    next();
  } else {
    res.status(403).json({
      success: false,
      auth: false,
      message: "Anda bukan member",
    });
  }
};
