const currentRound = async () => {
  const repsonse = await fetch('http://localhost:3000/round/current', {
    method: 'GET',
    credentials: 'include'
  });

  const data = await repsonse.json();   // reads response, parses it as json and returns an JS object;

  if (!repsonse.ok) {
    const error = new Error(data.error || 'Error fetching current round');
    error.status = data.status;
    throw error
  }



  return data; // Round id for active round

}


export default currentRound;
