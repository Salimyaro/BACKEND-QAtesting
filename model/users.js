const User = require("./schemas/user");

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findById = async (id) => {
  return await User.findOne({ _id: id });
};

const create = async ({ email, password }) => {
  const user = new User({ email, password });
  return await user.save();
};

const addSession = async (id, sid) => {
  const { sessions } = await findById(id);
  sessions.push(sid);
  return await User.findOneAndUpdate({ _id: id }, { sessions });
};

const delSession = async (id, sid) => {
  const { sessions } = await findById(id);
  const index = sessions.indexOf(sid);
  if (index > -1) {
    sessions.splice(index, 1);
  }
  return await User.findOneAndUpdate({ _id: id }, { sessions });
};


// const updateAvatarUrl = async (id, avatar) => {
//   return await User.updateOne({ _id: id }, { avatar });
// };

module.exports = {
  findByEmail,
  findById,
  create,
  addSession,
  delSession,
  // updateAvatarUrl,
};
