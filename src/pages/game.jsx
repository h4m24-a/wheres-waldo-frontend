// Display the selected level using id in url parameter
import { useState, useRef } from "react"
import Modal from  "../components/modal";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import getLevel from "../services/level";

export default function Game() {


  const { imageId } = useParams()
  console.log(imageId)
  const [position, setPosition] = useState({ x: undefined, y: undefined });
  // const [characters, setCharacters] = useState([])
  const [showModal, setShowModal] = useState(false)
  const imgRef = useRef(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['level'],
    queryFn: () => getLevel(imageId)
  });


  
  
  if (isLoading) {
    return <div>Loading Level...</div>
  }
  
  if (isError || !data.level) {
    return <div>Error fetching level... </div>
  }



  const HandleClick = (e) => {

    const rect = imgRef.current.getBoundingClientRect(); // bounding rectangle relative to viewport
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({x,y})

    setShowModal(!showModal)
    
};




 
  return (
    <>
      <main>
        <div className="flex flex-col justify-center items-center">
          {/* <p className="text-center font-poppins text-red-500">
            X: {position.x}, Y: {position.y}
          </p> */}
          <h1 className="text-4xl text-center  rounded uppercase text-red-500 px-8 py-3 font-bungee ">
            {" "}
            <span className=" text-blue-400 pr-2">Where's</span> Wally?
          </h1>
          
        </div>

        
        <div className="mx-auto relative w-[1464px] h-[919px]">

          
          <img
            ref={imgRef}
            onClick={HandleClick}  // e is automatically passed
            id="level"
            className="p-0.5 w-full h-auto cursor-pointer  border-4 border-black"
            src={data.level.path}
            alt={data.level.name}
          />


      { position.x && position.y && (
        <div
          className="absolute p-3.5 rounded  border-4 border-purple-600 box-border"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: "translate(-50%, -50%)", // center div on click-  1st value left or right,  2nd value up or down
          }}
        ></div>

      )}

          
          {showModal &&  <Modal  top={position.y} left={position.x} characters={data.level.characters} />}
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