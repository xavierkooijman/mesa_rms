const jwt = require("jsonwebtoken");
require("dotenv").config();

const signAccessToken = (id, role, ctxHash) => {
  return jwt.sign(
    {
      sub: id,
      role: role,
      ctx: ctxHash,
    },
    process.env.ACCESS_JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

const signRefreshToken = (id, tokenId) => {
  return jwt.sign(
    {
      sub: id,
      tokenId: tokenId,
    },
    process.env.REFRESH_JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

module.exports = { signAccessToken, signRefreshToken };
