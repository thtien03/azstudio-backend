import express from "express";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  login = async (request, response) => {
    try {
      const { username, password } = request.body;
      const user = await UserModel.findOne({ username });
      if (!user)
        return response
          .status(400)
          .json({ message: "This username does not exist." });

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

      response
        .status(200)
        .json({ accessToken: access_token, message: "Login successfully." });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  };

  getAccessToken = async (
    request,
    response
  ) => {
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
}
const createRefreshToken = (payload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
const createAccessToken = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

export default new UserController();
