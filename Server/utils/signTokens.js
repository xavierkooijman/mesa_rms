const jwt = require("jsonwebtoken");
require("dotenv").config();

const signAccessToken = (id, globalRole, ctxHash, tenant) => {
  return jwt.sign(
    {
      sub: id,
      globalRole: globalRole,
      ctx: ctxHash,
      tenant: tenant,
    },
    process.env.ACCESS_JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

const signRefreshToken = (id, refreshtokenId, expiresAt) => {
  return jwt.sign(
    {
      sub: id,
      tokenId: refreshtokenId,
      exp: expiresAt,
    },
    process.env.REFRESH_JWT_SECRET
  );
};

module.exports = { signAccessToken, signRefreshToken };
