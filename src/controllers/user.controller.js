import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

class UserController {
  login = async (request, response) => {
    try {
      const { username, password } = request.body;
      const user = await UserModel.findOne({ username });
      if (!user)
        return response
          .status(400)
          .json({ message: "This username does not exist." });
      if (user.status !== "active")
        return response
          .status(403)
          .json({ message: "User is not active. Please contact support." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return response.status(400).json({ message: "Password is incorrect." });

      const refresh_token = createRefreshToken({ id: user._id });
      const access_token = createAccessToken({ id: user._id });

      response.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/v1/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production" ? true : false,
      });

      response.status(200).json({
        accessToken: access_token,
        isAdmin: user.isAdmin,
        message: "Login successfully.",
      });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  };

  getAccessToken = async (request, response) => {
    try {
      const refresh_token = request.cookies.refreshtoken;

      if (!refresh_token)
        return response
          .status(400)
          .json({ message: "Haven't token.Please login now!" });

      jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err)
            return response.status(400).json({ message: "Please login now!" });
          console.log("check refresh token", user);
          const access_token = createAccessToken({
            id: user.id,
          });

          response.status(200).json({ access_token: access_token });
        }
      );
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  };

  logout = async (request, response) => {
    try {
      response.clearCookie("refreshtoken", {
        path: "/api/v1/user/refresh_token",
      });
      response.status(200).json({ message: "Logged out!" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  };

  register = async (request, response) => {
    try {
      const { name, username, email, password } = request.body;
      console.log(request.body);
      // Kiểm tra nếu các trường cần thiết bị thiếu
      if (!name || !username || !email || !password) {
        return response
          .status(400)
          .json({ message: "Please fill in all information." });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return response.status(400).json({ message: "Invalid email format." });
      }
      // Kiểm tra xem email đã tồn tại chưa
      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) {
        return response.status(400).json({ message: "Email already exists." });
      }

      // Kiểm tra xem username đã tồn tại chưa
      const existingUsername = await UserModel.findOne({ username });
      if (existingUsername) {
        return response
          .status(400)
          .json({ message: "Username already exists." });
      }

      // Mã hóa mật khẩu bằng bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo người dùng mới
      const newUser = new UserModel({
        name,
        username,
        email,
        password: hashedPassword,
      });

      // Lưu người dùng vào cơ sở dữ liệu
      await newUser.save();

      return response.status(201).json({ message: "Registration successful!" });
    } catch (error) {
      console.error("Error while registering user:", error);
      return response
        .status(500)
        .json({ message: "An error occurred. Please try again later." });
    }
  };

  blockUser = async (request, response) => {
    try {
      // Lấy userId từ tham số URL (ví dụ: /user/block/:userId)
      const { userId } = request.params;

      // Tìm người dùng trong cơ sở dữ liệu
      const user = await UserModel.findById(userId);

      // Kiểm tra nếu người dùng không tồn tại
      if (!user) {
        return response.status(404).json({ message: "User not found" });
      }

      // Toggle user status
      if (user.status === "inactive") {
        user.status = "active";
        await user.save();
        return response
          .status(200)
          .json({ message: "User has been activated successfully" });
      } else {
        user.status = "inactive";
        await user.save();
        return response
          .status(200)
          .json({ message: "User has been blocked successfully" });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal Server Error" });
    }
  };

  listAllUsers = async (request, response) => {
    try {
      const { page = 1, pageSize = 10 } = request.query;
      const skip = (page - 1) * pageSize;

      const users = await UserModel.find({}, { password: 0 }) // không lấy password
        .skip(skip)
        .limit(Number(pageSize))
        .exec();

      const totalUsers = await UserModel.countDocuments();

      return response.status(200).json({
        data: users,
        total: totalUsers,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(totalUsers / pageSize),
      });
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };
}
const createRefreshToken = (payload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
const createAccessToken = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

export default new UserController();
