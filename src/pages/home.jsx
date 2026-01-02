// Where users will be able to select different levels, POST request is made to start the game after the user selects a level.
// Use id of image in req.body to load a level
// Display levels

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import getAllLevels from "../services/levels";

export default function Homepage() {
  const {
    data: levels,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["levels"],
    queryFn: () => getAllLevels(),
  });

  if (isLoading) {
    return <div>Loading Levels...</div>;
  }

  if (isError || !levels) {
    return <div>Error fetching levels</div>;
  }

  return (
    <>
      <main className=" h-screen bg-black">
        <h1 className="text-3xl border-white border-4 h-23 text-white p-3 text-center uppercase font-bungee">
          Welcome to the Wheres Wally games!
        </h1>
        <h2 className="text-4xl  border-white border-4 text-center  rounded uppercase text-red-500  font-bungee ">
          Select
          <span className=" text-blue-400 pr-2"> Level</span>
        </h2>{" "}


        <div className="max-w-7xl mx-auto mt-5 ">
          <div className="grid grid-cols-3">
            {levels.map((level) => (
              <Link
                to={`/round/start/${level.Id}`}
                key={level.id}
                className=" cursor-pointer"
              >
                <img
                  className=" border-white border-8 rounded-2xl  w-auto h-auto mx-auto object-contain"
                  src={level.path}
                  alt={level.name}
                />
                <p className="text-center text-lg text-white font-poppins mt-1">
                  {level.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
        
      </main>
    </>
  );
}
