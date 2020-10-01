//To fetch the user id from the email
const getUserByEmail = (users, email) => {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user].id;
    }
  }
};

//Function verify if the user exits before registering a new user
const checkExistingUser = function (users, email) {
  for (let user in users) {
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
    if (users[user].password === password) {
      return true;
    } else {
      false;
    }
  }
}

//Function to filter the urls userwise
const urlsForUser =  function (urlDatabase,id) {
  let filteredObj = {};
  for (let urlKey in urlDatabase) {
    if (id === urlDatabase[urlKey].userID) {
      filteredObj[urlKey] = {
        shortURL: urlKey,
        longURL: urlDatabase[urlKey].longURL,
        userID: urlDatabase[urlKey].userID,
      }
    }
  }
  return filteredObj;
}

module.exports = { getUserByEmail, checkExistingUser,passwordMatch,urlsForUser };
