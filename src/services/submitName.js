const submitName = async (username) => {
  const response = await fetch("http://localhost:3000/submit", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  const data = await response.json(); // reads response, parses it as json and returns an JS object;

  if (!response.ok) {
    const error = new Error(data.error || "Error fetching current round");
    error.status = data.status;
    throw error;
  }

  return data;
};


export default submitName;