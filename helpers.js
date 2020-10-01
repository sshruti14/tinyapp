const getUserByEmail =  (users,email)=> {
  for (let user in users) {
    console.log('Email'+users[user].email);
    console.log('Passed Email'+email);
    console.log('Id'+ users[user].id);
    if (users[user].email === email) {
      console.log('Found'+users[user].id);
      return users[user].id;
    }
  }
}

module.exports = {getUserByEmail};