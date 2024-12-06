import md5 from "md5";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const secretKey = "cuaks";

export const authenticate = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userCek = await prisma.user.findFirst({
      where: {
        username: username,
        password: md5(password),
      },
    });
    if (userCek) {
      const payload = JSON.stringify(userCek);
      const token = jwt.sign(payload, secretKey);
      res.status(200).json({
        status: true,
        message: "login berhasil",
        token: jwt.sign(payload, secretKey),
        loggedin: userCek.username,
      });
    } else {
      res.status(404).json({
        succes: false,
        logged: false,
        message: "username or password invalid",
      });
    }
  } catch (error) {
    console.log("cek");
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log("Cek authHeader:", authHeader);

    // Periksa apakah header Authorization ada
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is missing",
      });
    }

    // Ambil token dari header (format: Bearer <token>)
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verifikasi token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      // Jika verifikasi berhasil, tambahkan data pengguna ke `req`
      req.user = decoded;
      next(); // Lanjutkan ke handler berikutnya
    });
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
