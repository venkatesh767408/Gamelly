export const validateEmail=(email)=>{
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email)
}


export const validatePassword=(password)=>{

      // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password)
}

export const validateUsername=(username)=>{

     // 3-20 characters, letters, numbers, underscores only
    const usernameRegex=/^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username)
}


// =======================
//  Create Team Validations
// =======================

// Validate Team Name (3–50 chars, letters, numbers, spaces allowed)
export const validateTeamName=(teamName)=>{
  const teamNameRegex = /^[A-Za-z0-9 ]{3,50}$/;
  return teamNameRegex.test(teamName)
}

// Validate Sport Type (letters and spaces only)
export const validateSportType=(sport)=>{
   const sportRegex = /^[A-Za-z ]{2,30}$/;
   return sportRegex.test(sport)
}


export const validateMaxPlayers = (maxPlayers)=>{
  return Number.isInteger(maxPlayers) && maxPlayers > 0 && maxPlayers <=50
}


export const validateCoachEmail=(email)=>{
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
}

