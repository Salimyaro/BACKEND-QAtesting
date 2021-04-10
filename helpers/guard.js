const passport = require("passport");
require("../config/passport");
const { HttpCode, Status } = require("./constants");

const guard = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, session) => {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!user || err || token !== session.token) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: Status.ERROR,
        code: HttpCode.UNAUTHORIZED,
        data: "Unauthorized",
        message: "Not authorized",
      });
    }
    req.user = user;
    req.session = session;
    return next();
  })(req, res, next);
};

const guardRefresh = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, session) => {
    const token = req.get("Authorization")?.split(" ")[1];
    if (!user || err || token !== session.refreshToken) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: Status.ERROR,
        code: HttpCode.UNAUTHORIZED,
        data: "Unauthorized",
        message: "Not authorized",
      });
    }
    req.user = user;
    req.session = session;
    return next();
  })(req, res, next);
};

module.exports = { guard, guardRefresh };
