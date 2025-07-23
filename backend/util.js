import "dotenv/config";
const secretKey = process.env.JWTSECRET;
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export const verifyToken = (req, res, next) => {
  try {
    // //get bearer header
    const bearHeader = req.headers.authorization;

    if (!bearHeader) {
      console.log("no token");
      res.status(401);
      const error = new Error();
      error.message = "unauthorized access please login";
      error.status = 401;
      throw error;
    }
    // Fallback to Authorization header if needed

    let token = bearHeader.split(" ")[1];

    verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Invalid token - unauthorized access" });
      }
      req.user = decoded;

      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
