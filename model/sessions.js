const Session = require("./schemas/session");

const findByUid = async (uid) => {
  return await Session.findOne({ uid });
};

const findBySid = async (sid) => {
  return await Session.findOne({ _id: sid });
};

const create = async (uid, token, refreshToken) => {
  const session = new Session({ uid, token, refreshToken });
  return await session.save();
};

const updateTokens = async (sid, token, refreshToken) => {
  return await Session.updateOne({ _id: sid }, { token, refreshToken });
};

const deleteSession = async (sid) => {
  return await Session.deleteOne({ _id: sid });
};

module.exports = {
  findByUid,
  findBySid,
  create,
  updateTokens,
  deleteSession,
};
