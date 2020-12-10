const validateEmailPassword = function(email,password, database){
  for(let data in database){
    if(database[data]['email'] === email && database[data]['password'] === password){
      return true; 
    }
  }
  return false;
}

const getUserId = function(email, database){
  for(let data in database){
    if(database[data]['email'] === email){
      return database[data];
    }
  }
}

module.exports = { validateEmailPassword, getUserId};