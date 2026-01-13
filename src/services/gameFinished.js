const gameFinished = async () => {
  const repsonse = await fetch('http://localhost:3000/round/finished', {
    method: 'GET',
    credentials: 'include'
  });

  const data = await repsonse.json();   // reads response, parses it as json and returns an JS object;

  if (!repsonse.ok) {
    const error = new Error(data.error || 'Error fetching round finished status');
    error.status = data.status;
    throw error
  }



  return data; // Finished boolean value

}


export default gameFinished;
