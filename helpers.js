const getUserByEmail = (users, email) => {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user].id;
    }
  }
};

const checkExistingUser = function (users, email) {
  for (let user in users) {
    console.log(users[user].email);
    console.log(email);
    if (users[user].email === email) {
      return true;
    } else {
      false;
    }
  }
};

//checks to see if password matches userid
const passwordMatch = (users, password) => {
  for (let user in users) {
    console.log(users[user].password);
    console.log(password);
    if (users[user].password === password) {
      return true;
    } else {
      false;
    }
  }
}

module.exports = { getUserByEmail, checkExistingUser,passwordMatch };
