const db = require("../config/db");

const saveRefreshToken = async (data) => {
  const { tokenId, hashedToken, userId, expires_at } = data;

  const query =
    "INSERT INTO refresh_tokens(token_id, token_hash, user_id, expires_at) VALUES($1, $2, $3, $4)";

  const values = [tokenId, hashedToken, userId, expires_at];

  await db.writePool.query(query, values);
};

const getRefreshToken = async (tokenId) => {
  const query =
    "SELECT token_hash, user_id FROM refresh_tokens WHERE revoked IS NOT TRUE AND token_id = $1";

  const { rows } = await db.readPool.query(query, [tokenId]);
  return rows[0];
};

const deleteRefreshToken = async (tokenId) => {
  const query = "DELETE FROM refresh_tokens WHERE token_id = $1";

  await db.writePool.query(query, [tokenId]);
};

module.exports = { saveRefreshToken, getRefreshToken, deleteRefreshToken };
