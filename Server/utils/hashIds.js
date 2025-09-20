const Hashids = require("hashids");
require("dotenv").config();

const hashids = new Hashids(process.env.HASHIDS_SECRET);

const createHashId = async (id) => {
  const hashedId = hashids.encode(id);
  return hashedId;
};

const decodeHashId = async (hashId) => {
  const decoded = hashId.decode(hashId);
  const internalId = decoded[0];
  return internalId;
};

module.exports = { createHashId, decodeHashId };
