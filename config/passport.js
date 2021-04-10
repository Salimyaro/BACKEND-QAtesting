const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const Users = require("../model/users");
const Sessions = require("../model/sessions");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

const params = {
  secretOrKey: SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, async (payload, done) => {
    try {
      const user = await Users.findById(payload.id);
      const isSessionValid = user.sessions.includes(payload.sid);
      if (!user) {
        return done(new Error("User not found"));
      }
      if (!isSessionValid) {
        return done(new Error("Session not valid"));
      }
      const session = await Sessions.findBySid(payload.sid);
      if (!session) {
        return done(new Error("Session not found"));
      }
      return done(null, user, session);
    } catch (err) {
      done(err);
    }
  })
);
