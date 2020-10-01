const getUserByEmail = (users, email) => {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user].id;
    }
  }
};

const checkExistingUser = function (users, email) {
  for (let user in users) {
    if (users[user].email === email) {
      return true;
    } else {
      false;
    }
  }
};

module.exports = { getUserByEmail, checkExistingUser };
