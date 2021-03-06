const Tests = require("../model/tests");
const { HttpCode, Status } = require("../helpers/constants");

const getTechResult = async (req, res, next) => {
  try {
    const allQuestions = await Tests.getAllByCategory("tech");
    const answers = req.body.answers;
    const correctCount = answers.reduce((sum, current) => {
      const question = allQuestions.find(
        (q) => q.questionId.toString() === current.questionId.toString()
      );
      if (question.rightAnswer === current.answer) {
        return sum + 1;
      }
      return sum;
    }, 0);
    const result = correctCount;
    let mainMessage;
    let secondaryMessage;
    switch (result) {
      case 12:
      case 11:
      case 10:
        mainMessage = "Great!";
        secondaryMessage = "Congratulations, you have a great tech knowledge";
        break;
      case 9:
      case 8:
      case 7:
      case 6:
        mainMessage = "Not bad!";
        secondaryMessage = "But you still need to learn some materials";
        break;
      case 5:
      case 4:
      case 3:
      case 2:
      case 1:
      case 0:
        mainMessage = "Keep learning!";
        secondaryMessage = "You still have a lot to learn, keep going!";
        break;
      default:
        break;
    }
    return res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        result,
        mainMessage,
        secondaryMessage,
      },
    });
  } catch (e) {
    next(e);
  }
};
const getTheoryResult = async (req, res, next) => {
  try {
    const allQuestions = await Tests.getAllByCategory("theory");
    const answers = req.body.answers;
    const correctCount = answers.reduce((sum, current) => {
      const question = allQuestions.find(
        (q) => q.questionId.toString() === current.questionId.toString()
      );
      if (question.rightAnswer === current.answer) {
        return sum + 1;
      }
      return sum;
    }, 0);
    const result = correctCount;
    let mainMessage;
    let secondaryMessage;
    switch (result) {
      case 12:
      case 11:
      case 10:
        mainMessage = "Great!";
        secondaryMessage = "Congratulations, you have a great theory knowledge";
        break;
      case 9:
      case 8:
      case 7:
      case 6:
        mainMessage = "Not bad!";
        secondaryMessage = "But you still need to learn some materials";
        break;
      case 5:
      case 4:
      case 3:
      case 2:
      case 1:
      case 0:
        mainMessage = "Keep learning!";
        secondaryMessage = "You still have a lot to learn, keep going!";
        break;
      default:
        break;
    }
    return res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        result,
        mainMessage,
        secondaryMessage,
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getTechResult,
  getTheoryResult,
};
