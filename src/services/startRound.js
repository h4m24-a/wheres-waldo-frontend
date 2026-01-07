const startRound = async (imageId) => {
  const response =  await fetch(`http://localhost:3000/round/start/${imageId}`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    const data = await response.json();
    const error = new Error(data.error || 'Error starting round');
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data;

}



export default startRound