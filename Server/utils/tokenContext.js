const crypto = require("crypto");

const tokenContext = () => {
  const contextRaw = crypto.randomBytes(32).toString("base64url");
  const contextHash = crypto
    .createHash("sha256")
    .update(contextRaw)
    .digest("base64url");

  return { contextRaw, contextHash };
};

module.exports = tokenContext;
