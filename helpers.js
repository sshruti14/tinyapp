//To fetch the user id from the email
const getUserByEmail = (users, email) => {
  for (let user in users) {
    if (users[user].email === email) {
      console.log('User Id Value'+users[user].id);
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
const passwordMatch = (bcrypt,user_id,users, password) => {

  console.log(password);
  console.log(users[user_id].password);
  return bcrypt.compareSync(password, users[user_id].password);
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
