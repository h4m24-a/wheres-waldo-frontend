// Display the selected level using id in url parameter
import { useState, useRef, useEffect } from "react"
import Modal from  "../components/modal";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getLevel from "../services/level";
import startRound from "../services/startRound";
import currentRound from "../services/currentRound";
import valiadateGuess from "../services/validateGuess";
import submitName from "../services/submitName";
import gameFinished from "../services/gameFinished";
import Form from "../components/form";
import leaderboard from "../services/leaderboard";
import { Navigate } from "react-router";

export default function Game() {
  const { imageId } = useParams();
  const Navigate = useNavigate()
  const queryClient = useQueryClient()
  const [position, setPosition] = useState({ x: undefined, y: undefined });
  const [showModal, setShowModal] = useState(false);
  const imgRef = useRef(null);
  const [characters, setCharacters] = useState([])
  const [characterFound, setCharacterFound] = useState([]);  // contains ID, name, x , y properties - populated on a correct guess
  const [guessResponse, setGuessResponse] = useState('');
  const [username, setUsername] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [win, setWin] = useState(false);
  const [time, setTime] = useState(undefined)

  // Get level
  const { data, isLoading, isError } = useQuery({
    queryKey: ["level", imageId],
    queryFn: () => getLevel(imageId),
    enabled: !!imageId, // getLevel isn't invoked without a imageId,
  });

  
  // const totalCharacterCount = data?.totalCharacterCount


  
  // GET current round if active - runs when component is mounted even after a refresh
  const {
    data: currentRoundData,  // + .roundId gives access to roundId
    isLoading: currentRoundLoading,
    isError: currentRoundError,
  } = useQuery({
    queryKey: ["currentRound"],     // queryKey is unique identifier for a query.
    queryFn: () => currentRound(),  
  });



  useEffect(() => {
    setCharacters(data?.characters)
  }, [data])
  
  
  
  const {data: gameFinishedData, isLoading: gameFinishedLoading, isError: gameFinishedError} = useQuery({
    queryKey: ["gameFinished"],
    queryFn: () => gameFinished()
  })

  const gameWon = gameFinishedData?.finished

 
  // Start Round - POST
  const startRoundMutation = useMutation({
    mutationFn: (imageId) => startRound(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentRound']})
      setFormMessage("");
      setCharacterFound([]);
      setGuessResponse("");
      setFormMessage("");
      setUsername("");
      setShowLeaderboard(false);
      setTime("")
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
      if (data.correctGuess) {
        setCharacterFound(prevData => [...prevData, { id:prevData.length + 1, name: data.name, x: position.x, y: position.y }])   //...spread operator for immutability, copies all previous data of array and creates a new shallow copy
        setGuessResponse(data.message)
      } else if (data.correctGuess == false) {
        setGuessResponse(data.message)
      } else if (data.duplicate === true) {
        setGuessResponse(data.message)
      } else {
        setGuessResponse(data.message) // Win Game
        setCharacterFound(prevData => [...prevData, { id: prevData.length + 1, name: data.name, x: position.x, y: position.y } ]) // For placing marker
        setWin(data.roundComplete)
        setTime(data.time)
      }
    }
  })
  




  // Submit Name - POST
  const submitNameMutation = useMutation({
    mutationFn: () => submitName(username),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["leaderboard"]);   // Rerun leaderboard query after user submits data
      if (data) {
        setFormMessage(data.message);
      } else {
        setFormMessage(data.error)
      }
    }
  })

  

  const HandleFormSubmit = async (e) => {
    e.preventDefault()
    submitNameMutation.mutate(username)
    setWin(false)
    setShowLeaderboard(true)
    window.scroll(0,0)
  }




  // Leaderboard -  GET
  const { data: leaderboardData, isLoading: leaderboardisLoading, isError: leaderboardIsError } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => leaderboard(imageId),
    enabled: !!showLeaderboard
  })


 


  // Format time
  const HandleTimeFormat = (time) => {
    if (!time) {
     return "NA";
}
    const hours = Number(time.hours || 0);
    const minutes = Number(time.minutes || 0)
    const seconds = Number(time.seconds || 0)

    // Displays hours in hh:mm:ss if its greater than 0
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // enures that minutes & seconds are always displayed as two digits (eg 09 instead of 9).
      
    } else if (minutes > 0) {   // Displays minutes and seconds if there is a minute
      return `${minutes.toString()}m:${seconds.toString().padStart(2, '0')}s`; // enures that minutes & seconds are always displayed as two digits (eg 09 instead of 9).

    } else {    // Else just only display seconds
      return `${seconds.toString()}s`; // enures that minutes & seconds are always displayed as two digits (eg 09 instead of 9).
      
    }
    
  }
  

  
  
  if (currentRoundLoading || currentRoundError) {
    return <div> Loading Active Round </div>;
  }


  if (gameFinishedLoading || gameFinishedError) {
    return <div> Checking if game is finished</div>
  }


  if (isLoading) {
    return <div>Loading Level...</div>;
  }


  if (isError || !data.level) {
    return <div>Error fetching level... </div>;
  }


  if (leaderboardisLoading) {
    return <div>Loading Leaderboard...</div>
  }

  if (leaderboardIsError) {
    return <div>Error fetching leaderboard</div>
  }




  

  return (
    <>
      <main>
        <div className="flex flex-col max-5xl-full w-full justify-center items-center">

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

          <p className="text-center font-poppins text-black font-bold">
            {guessResponse}
          </p>

          <p className="text-center font-poppins text-black font-bold">
            {formMessage}
          </p>
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


          {characterFound.map((c, index) => (
            <div key={index + 1}
            className="absolute p-3.5 rounded  border-4 border-blue-600 box-border"
            style={{
              left: `${c.x}px`,
              top: `${c.y}px`,
              transform: "translate(-50%, -50%)", // center div on click-  1st value left or right,  2nd value up or down
            }}
            ></div>

          ))}

          {showModal && (
            <Modal
              top={position.y}
              left={position.x}
              characters={characters}
              onClick={HandleCharacterNameChange} // eg HandleCharacterName('wally') but wally is retrieved from the modal
            />
          )}
        </div>

        { (gameWon || win) &&
        <Form
        HandleFormFunction={HandleFormSubmit}
        value={username}
        onChange={setUsername}
        time={HandleTimeFormat(time)}
        />
        } 


       { showLeaderboard && ( 
          <div className="flex  flex-col max-h-full scroll-m-3 items-center justify-center absolute inset-0 backdrop-blur-xl bg-opacity-50">
            <h1 className="text-4xl font-bungee font-bold text-center mt-3 ">Leaderboard</h1>
            <table className="max-w-6xl w-full mx-auto mt-5 mb-5 bg-white shadow-lg border-collapse rounded-lg ">
            <thead className=" bg-gray-300  p-12 border-b-3 border-b-solid border-b-emerald-50 text-left tracking-tighter opacity-70 uppercase font-poppins font-bold ">
              <tr>
                <th className="bg-gray-300 p-3   rounded-tl-lg  border-b-3 border-b-solid border-b-zinc-100 text-left tracking-tighter opacity-70 uppercase font-poppins font-bold ">#</th>
                <th className="bg-gray-300 p-3  border-b-3 border-b-solid border-b-zinc-100 text-left tracking-tighter opacity-70 uppercase font-poppins font-bold ">Name</th>
                <th className="bg-gray-300 p-3  rounded-tr-lg border-b-3 border-b-solid border-b-zinc-100 text-left tracking-tighter opacity-70 uppercase font-poppins font-bold ">Time</th>
              </tr>
            </thead>
            <tbody>
  
              {leaderboardData.map((l, index) => {
                return (
                  <tr className="p-4 mb-8 text-left font-poppins border-b-solid border-b-gray-100 " key={l.id}>
                    <td className="font-bold p-4 mb-8 text-left font-poppins border-b-solid border-b-gray-100">{index + 1}</td>
                    <td className="p-4 mb-8 text-left font-poppins border-b-solid border-b-gray-100">{l.name}</td>
                    <td className="p-4 mb-8 text-left font-poppins border-b-solid border-b-gray-100">  
                      <time>{HandleTimeFormat(l.time)}</time>
                      </td>  
                  </tr>
                );
              })}
              </tbody>
            </table>
            
            <div className="flex flex-row gap-2">
              <button 
                onClick={() => Navigate('/')} 
                className="px-6 py-3 text-white bg-gray-950 border-4 border-black block mx-auto hover:bg-gray-800 hover:border-gray-800 rounded-lg cursor-pointer font-bold transition-all duration-200 transform" >
              Select Level
              </button>

            </div>
          </div>
        )} 



  
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



//TODO: Display users  own time in the leaderboard component