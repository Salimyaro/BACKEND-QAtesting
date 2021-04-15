const Tests = require("./schemas/tests");

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function getAllByCategory(category) {
  const allTests = await Tests.find({ category });
  return allTests;
}
async function getShuffled12TestsByCategory(category) {
  const allTests = await Tests.find({ category }).select(
    "-rightAnswer -category -_id"
  );
  allTests && shuffleArray(allTests);
  return allTests?.slice(0, 12);
}
module.exports = {
  getShuffled12TestsByCategory,
  getAllByCategory,
};
