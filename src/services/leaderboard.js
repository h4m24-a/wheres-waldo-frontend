const leaderboard =  async (imageId) => {
  const response = await fetch(`http://localhost:3000/leaderboard/${imageId}`, {
    method: 'GET',
    credentials: 'include'
  })

 const data = await response.json(); // reads response, parses it as json and returns an JS object;

  if (!response.ok) {
    const error = new Error(data.error || 'Error fetching leaderboard');
    error.status = data.status
    throw error  // throwing the above error that already exists
  }

  return data.leaderboard; // returns name, time, round_id and image_id
}


export default leaderboard;




// throw Error is used when you create and throw an error in one step, usually by calling new Error().
// throw error is used when you're throwing an error that has already been created or is passed in from another part of the code.