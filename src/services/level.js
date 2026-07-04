// Function call to return the selected level
const getLevel = async (imageId) => {
  const response = await fetch(`https://wheres-waldo-game-production.up.railway.app/round/start/${imageId}`, {
    method: 'GET',
    credentials: 'include'
  })

  if (!response.ok) {
    const data = await response.json()
    const error = new Error(data.error || 'Error fetching level');
    error.status = response.status;
    throw error
  }

  const data = await response.json();   // reads response, parses it as json and returns an JS object;
  return data;
}


export default getLevel;