import db from '../db/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();



// ================= REGISTER =================
export const register = async (req, res) => {
  try {

    const { name, username, password, tel } = req.body;

    if (!username || !password || !name || !tel) {
      return res.status(400).json({
        message: "No user data"
      });
    }

    // เช็คว่ามี Username ซ้ำหรือไม่
    const checkUserSql =
      "SELECT * FROM users Where username = $1";

    const checkUser = await db.query(checkUserSql, [username]);
    // return res.json(checkUser.rowCount);

    // ถ้า Username ซ้ำ ให้ส่งแจ้ง Status400 มีผู้ใช้แล้ว
    if (checkUser.rowCount > 0) {
      return res.status(400).json({
        message: "Username already exits."
      });
    }

    // ถ้าไม่ซ้ำ เพิ่มข้อมูลในตาราง users
    const insertSql =
      "INSERT INTO users(username, password, name, tel) VALUES ($1, $2, $3, $4) RETURNING *";

    const hash_password = await bcrypt.hash(password, 10); // การเข้ารหัส

    const newUser = await db.query(insertSql, [
      username,
      hash_password,
      name,
      tel
    ]);

    const user = newUser.rows[0];

    return res.status(201).json({
      message: "User registered.",
      user: newUser.rows[0]
    });

  } catch (err) {
    return res.status(500).json({
      message: "error: " + error
    });
  }
};



// ================= LOGIN =================
export const login = async (req, res) => {

  const { username, password } = req.body ?? {};

  // ตรวจสอบการรับค่า username & password
  if (!username || !password) {
    return res.status(400).json({
      message: "username & password are required"
    });
  }

  // ตรวจสอบ user ว่ามีอยู่มั้ย
  try {

    const userSql =
      "SELECT * FROM users WHERE username = $1 LIMIT 1";

    const { rows } = await db.query(userSql, [username]);
    const user = rows[0];

    // return res.json({ user }); // Debug Test Login

    // กรณีไม่มีชื่อผู้ใช้
    if (!user) {
      return res.status(400).json({
        message: "user not found"
      });
    }

    // ตรวจสอบ Password
    const checkPass = await bcrypt.compare(
      password,
      user.password
    );

    if (!checkPass) {
      return res.status(400).json({
        message: "Wrong Password"
      });
    }

    // username & password ถูกต้อง
    // สร้าง access token และ refresh token
    const payload = {
      userid: user.id,
      username: user.username,
      tel: user.tel
    };

    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      payload,
      accessToken,
      refreshToken
    });

  } catch (err) {
    return res.status(500).json({
      message: "error: " + error
    });
  }
};


export const refresh = async (req, res) => {
  const { token } = req.body;
  // ไม่มี token
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {

      // token ไม่ถูกต้อง / หมดอายุ
      if (err) {
        return res.sendStatus(403);
      }

      // สร้าง access token ใหม่
      const accessToken = jwt.sign(
        {
          userId: user.userId,
          username: user.username,
          tel: user.tel
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({accessToken});
    }
  );

};

