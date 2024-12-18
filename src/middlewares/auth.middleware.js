import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    // const token = req.header("Authorization");
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "Invalid Authentication." });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) return res.status(403).json({ message: error.name });

      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export default auth;
