// Validating Guess - Accepts x, y & character_name
const valiadateGuess = async (imageId, x, y, character_name) => {
  const repsonse = await fetch('http://localhost:3000/guess', {
    method: 'POST',
    credentials: 'include',
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({ imageId, x, y, character_name })
  }) 

    const data = await repsonse.json();   // reads response, parses it as json and returns an JS object;

  if (!repsonse.ok) {
    const error = new Error(data.error || 'Error fetching current round');
    error.status = data.status;
    throw error
  }


  return data;


}


export default valiadateGuess;