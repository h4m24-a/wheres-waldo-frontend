const Modal = ( { characters, top, left, onClick, className = "" } ) => {  // characters is an array of objects, top & left for position of modal using coordinates
  return (
    <div
    style={{ minWidth: `${140}px`, top: `${top}px`, left: `${left}px` }}
    className={
      `border-2 bg-white mt-15    absolute rounded translate-x-1/5 -translate-y-1/2 ${className}` // className with default styles, className prop used to add additional styles
      }
    >
    

      {characters.map((character) => {
        return (
          <div 
            onClick={() => onClick(character.name)} // passing character name to parent component
            key={character.name} className=" grid grid-cols-2  place-items-center px-2 rounded py-0.5  transition-transform duration-300 ease-in-out  hover:shadow overflow-hidden gap-1 cursor-pointer">
            <img
            src={character.image}
            alt={character.name}
            className="w-14 h-14 object-contain" 
            />

            <p className="font-bungee text-sm font-bold">{character.name}</p>
        </div>
        )

      })}

    </div>
  )
}



export default Modal


/*
When a character is clicked in the modal, the onClick handler will be called with character.name as an argument. (the HandleCharacterName function from the parent) will be triggered.

Modal component uses an inline arrow function to pass the specific character.name to the HandleCharacterName function in game.jsx

The parent component HandleCharacterName in game.jsx will receive the character.name and then it stores in the characterName state

*/