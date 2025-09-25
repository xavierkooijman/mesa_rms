const jwt = require("jsonwebtoken");
require("dotenv").config();

const signAccessToken = (id, ctxHash, tenant) => {
  return jwt.sign(
    {
      sub: id,
      ctx: ctxHash,
      tenant: tenant,
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
