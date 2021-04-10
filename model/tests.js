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

// async function addContact(body) {
//   return await Contact.create(body);
// }

// async function listContacts(userId, { limit = "20", page = "1", sub }) {
//   const subscription = sub ? { subscription: [sub] } : {};
//   const results = await Contact.paginate(
//     {
//       owner: userId,
//       ...subscription,
//     },
//     {
//       limit,
//       page,
//       populate: {
//         path: "owner",
//         select: "id",
//       },
//     }
//   );
//   const { docs: contacts, totalDocs: total } = results;
//   return { total: total.toString(), limit, page, contacts };
// }

// async function updateContact(id, body, userId) {
//   return await Contact.findByIdAndUpdate(
//     { _id: id, owner: userId },
//     { ...body },
//     { new: true }
//   ).populate({
//     path: "owner",
//     select: "id",
//   });
// }

// async function removeContact(id, userId) {
//   return await Contact.findByIdAndRemove({ _id: id, owner: userId });
// }

module.exports = {
  getShuffled12TestsByCategory,
  getAllByCategory,
  // addContact,
  // listContacts,
  // getContactById,
  // updateContact,
  // removeContact,
};
