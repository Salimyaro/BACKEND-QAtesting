const Tests = require("../model/tests");
const { HttpCode, Status } = require("../helpers/constants");

const getTech = async (_req, res, next) => {
  try {
    const tests = await Tests.getShuffled12TestsByCategory("tech");
    return res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        tests,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getTheory = async (_req, res, next) => {
  try {
    const tests = await Tests.getShuffled12TestsByCategory("theory");
    return res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        tests,
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getTech,
  getTheory,
};
