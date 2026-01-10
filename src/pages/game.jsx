// Display the selected level using id in url parameter
import { useState, useRef } from "react"
import Modal from  "../components/modal";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getLevel from "../services/level";
import startRound from "../services/startRound";
import currentRound from "../services/currentRound";
import valiadateGuess from "../services/validateGuess";

export default function Game() {
  const { imageId } = useParams();
  const queryClient = useQueryClient()
  const [position, setPosition] = useState({ x: undefined, y: undefined });
  const [showModal, setShowModal] = useState(false);
  const imgRef = useRef(null);
  const [characterFound, setCharacterFound] = useState([]);
  const [guessResponse, setGuessResponse] = useState('');
  const [gameWon, setGameWon] = useState(false)


  // Get level
  const { data, isLoading, isError } = useQuery({
    queryKey: ["level", imageId],
    queryFn: () => getLevel(imageId),
    enabled: !!imageId, // getLevel isn't invoked without a imageId,
  });

  
  const totalCharacterCount = data?.totalCharacterCount


  
  // GET current round if active - runs when component is mounted even after a refresh
  const {
    data: currentRoundData,  // + .roundId gives access to roundId
    isLoading: currentRoundLoading,
    isError: currentRoundError,
  } = useQuery({
    queryKey: ["currentRound"],     // queryKey is unique identifier for a query.
    queryFn: () => currentRound(),  
  });



  

  // Start Round - POST
  const startRoundMutation = useMutation({
    mutationFn: (imageId) => startRound(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentRound']})
    }
  });
  
  const roundId = currentRoundData?.roundId  // Gets Round Id - reflects the actual round in session.
  const roundStarted = Boolean(roundId)      // Checks to see if roundId is true
  


  
  const HandleClick = (e) => {
    if (!roundStarted) return;
    const rect = imgRef.current.getBoundingClientRect(); // bounding rectangle relative to viewport
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
    
    setShowModal(!showModal);
  };


  // Retrieve Character Name from Modal - receives the name of the character when clicked
  const HandleCharacterNameChange = (name) => {
    setShowModal(false);
    validateGuessMutation.mutate({ name })
  };
  

  // Validate Guess - POST
  const validateGuessMutation = useMutation({
    mutationFn: ( { name }) => valiadateGuess(imageId, position.x, position.y, name),   // name is retrieved from the modal
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['currentRound']})
      if (data.correctGuess) {
        setCharacterFound(prevName => [...prevName, data.name])
        setGuessResponse(data.message)
      } else if (data.correctGuess == false) {
        setGuessResponse(data.message)
      } else if (data.duplicate === true) {
        setGuessResponse(data.message)
      } else {
        setGuessResponse(data.message) // Win Game
        setCharacterFound(prevName => [...prevName, data.name])
        setGameWon(true)
      }
    }
  })
  


  console.log(characterFound)
  console.log(gameWon)
  
  
  if (currentRoundLoading || currentRoundError) {
    return <div> Loading Active Round </div>;
  }



  if (isLoading) {
    return <div>Loading Level...</div>;
  }


  if (isError || !data.level) {
    return <div>Error fetching level... </div>;
  }


  return (
    <>
      <main>
        <div className="flex flex-col justify-center items-center">
          <p className="text-center font-poppins text-black font-bold">
            {guessResponse}
          </p>

          <h1 className="text-4xl text-center  rounded uppercase text-red-500 px-8 py-3 font-bungee ">
            {" "}
            <span className=" text-blue-400 pr-2">Where's</span> Wally?
          </h1>

          <button
            onClick={() => startRoundMutation.mutate(imageId)}
            disabled={roundStarted}   // button can't be clicked once roundStarted is true. after user  starts round
            className={` 
                p-2 font-play text-md mb-2 border-2 cursor-pointer rounded border-black 
                 ${
                   roundId
                     ? "bg-green-200 text-green-800"
                     : "bg-amber-600 hover:bg-amber-700"
                 }
                `}
          >
            {roundStarted ? "Round Started" : "Start Round"}
          </button>

          {roundStarted && (
            <p className="font-poppins text-xs text-blue-400">{roundStarted} </p>
          )}
        </div>

        <div className="mx-auto relative w-[1464px] h-[919px]">
          <img
            ref={imgRef}
            onClick={roundStarted? HandleClick : undefined} // e is automatically passed / user can't select image until round started
            id="level"
            className="p-0.5 w-full h-auto cursor-pointer  border-4 border-black"
            src={data.level.path}
            alt={data.level.name}
            style={
              {
                pointerEvents: roundStarted ? 'auto': 'none' // disable pointer if round isn't started
              }
            }
          />

          {position.x && position.y && (
            <div
              className="absolute p-3.5 rounded  border-4 border-purple-600 box-border"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: "translate(-50%, -50%)", // center div on click-  1st value left or right,  2nd value up or down
              }}
            ></div>
          )}

          {showModal && (
            <Modal
              top={position.y}
              left={position.x}
              characters={data.characters}
              onClick={HandleCharacterNameChange} // eg HandleCharacterName('wally') but wally is retrieved from the modal
            />
          )}
        </div>
      </main>
    </>
  );
}



// Tolerance of 30 + and - to calculate min and max

// wally is   X: 414.5,   Y: 320
// wenda is   X: 371.5,   Y: 664
// wizard is  X: 892.5,   Y: 804
// odlaw is   X: 874.5,   Y: 599
// woof is    X: 893.5,   Y: 396


// use an event listener and listen for a click for the above coordinates
// use state to track the x & y cordinates
// maybe use an onClick or eventListener, when clicked grab the coordiantes and see if the match the coordinate range in database.

// use page x & y coordinates

/*
It is an object that contains information about the interaction with an element of your page aka the event. 
In this case it contains information about a mouse click event, 
such as which element of the page was targeted by the user when they clicked - the target
*/




// OR

/* no max and min and have a single set of coordinates with a tolerance of 30+ pixels

    Let’s say Wally’s ideal point is:

    x = 538

    y = 500

    tolerance = 30

    Then:

    x_min becomes 508

    x_max becomes 568

    y_min becomes 470

    y_max becomes 530

*/


//TODO: Indicate to the user that a guess is correct or not
//TODO: Black out characters they've found
//TODO: Display input for user to submit their username after winning/
//TODO: Redirect to leaderboard after submitting