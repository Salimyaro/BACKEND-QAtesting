const jwt = require("jsonwebtoken");
const Users = require("../model/users");
const Sessions = require("../model/sessions");
// const fs = require("fs/promises");
// const path = require("path");
// const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
// const checkOrMakeFolder = require("../helpers/create-dir");
const queryString = require("query-string");
const axios = require("axios");
const { HttpCode, Status } = require("../helpers/constants");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;
// const PORT = process.env.PORT;

const register = async ({ body }, res, next) => {
  try {
    const user = await Users.findByEmail(body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: Status.ERROR,
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }
    const newUser = await Users.create(body);
    const id = newUser._id;
    const session = await Sessions.create(id, null, null);
    const sid = session._id;
    const payload = { id, sid };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "30d",
    });
    await Users.addSession(id, sid);
    await Sessions.updateTokens(sid, token, refreshToken);
    return res.status(HttpCode.CREATED).json({
      status: Status.SUCCESS,
      code: HttpCode.CREATED,
      message: "user created",
      data: {
        token,
        refreshToken,
        email: newUser.email,
        id,
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async ({ body }, res, next) => {
  try {
    const user = await Users.findByEmail(body.email);
    const isValidPassword = await user?.validPassword(body.password);
    if (!user || !isValidPassword) {
      return res.status(HttpCode.FORBIDDEN).json({
        status: Status.ERROR,
        code: HttpCode.FORBIDDEN,
        message: "Email or password is wrong",
      });
    }
    const id = user._id;
    const session = await Sessions.create(id, null, null);
    const sid = session._id;
    const payload = { id, sid };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "30d",
    });
    await Users.addSession(id, sid);
    await Sessions.updateTokens(sid, token, refreshToken);
    return res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        token,
        refreshToken,
        email: user.email,
        id,
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async ({ user, session }, res, next) => {
  try {
    await Users.delSession(user._id, session._id);
    await Sessions.deleteSession(session._id);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (e) {
    next(e);
  }
};

const current = async ({ user }, res, next) => {
  try {
    res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        email: user.email,
        id: user._id,
      },
    });
  } catch (e) {
    next(e);
  }
};

const googleAuth = async (_req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });
  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );
};

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;
  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });
  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });
  let user = await Users.findByEmail(userData.data.email);
  if (!user) {
    const pass = uuidv4();
    user = await Users.create({
      email: userData.data.email,
      password: pass,
    });
  }
  const id = user._id;
  const session = await Sessions.create(id, null, null);
  const sid = session._id;
  const payload = { id, sid };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  const refreshToken = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "30d",
  });
  await Users.addSession(id, sid);
  await Sessions.updateTokens(sid, token, refreshToken);

  return res.redirect(
    `${process.env.FRONTEND_URL}/google-auth?token=${token}&refreshToken=${refreshToken}`
  );
};

const refresh = async ({ user, session }, res, next) => {
  try {
    await Users.delSession(user._id, session._id);
    await Sessions.deleteSession(session._id);

    const id = user._id;
    const newSession = await Sessions.create(id, null, null);
    const sid = newSession._id;
    const payload = { id, sid };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "30d",
    });
    await Users.addSession(id, sid);
    await Sessions.updateTokens(sid, token, refreshToken);

    return res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        token,
        refreshToken,
        email: user.email,
        id,
      },
    });
  } catch (e) {
    next(e);
  }
};

// const avatars = async (req, res, next) => {
//   try {
//     const avatarUrl = await saveAvatarToStatic(req);
//     await Users.updateAvatarUrl(req.user._id, avatarUrl);
//     return res.json({
//       status: Status.SUCCESS,
//       code: HttpCode.OK,
//       data: {
//         avatarUrl,
//       },
//     });
//   } catch (e) {
//     next(e);
//   }
// };

// const saveAvatarToStatic = async ({ user, file }) => {
//   const USERS_AVATARS_DIR = process.env.USERS_AVATARS_DIR;
//   const newAvatarName = `${Date.now()}-${file.originalname}`;
//   const img = await Jimp.read(file.path);
//   img
//     .autocrop()
//     .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
//     .writeAsync(file.path);

//   await checkOrMakeFolder(path.join(USERS_AVATARS_DIR, user._id));
//   await fs.rename(
//     file.path,
//     path.join(USERS_AVATARS_DIR, user._id, newAvatarName)
//   );
//   const avatarUrl = path.normalize(
//     path.join(`http://localhost:${PORT}/images`, user._id, newAvatarName)
//   );

//   return avatarUrl;
// };

module.exports = {
  register,
  login,
  logout,
  current,
  googleAuth,
  googleRedirect,
  refresh,
  // avatars,
};
