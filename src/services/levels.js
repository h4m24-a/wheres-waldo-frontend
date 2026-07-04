// Function call to return all levels
const getAllLevels = async () => {
  const response = await fetch("https://wheres-waldo-game-production.up.railway.app/menu", {
    method: 'GET',
    credentials:'include'
  });

  if (!response.ok) {
    const data = await response.json();
    const error = new Error(data.error || "Failed to fetch levels")
    error.status = response.status
    throw error
  }

  const data = await response.json(); // parses json into javascript object
  return data;

}

export default getAllLevels