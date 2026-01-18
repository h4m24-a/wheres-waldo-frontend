const Form = ({ HandleFormFunction,  value, onChange, time }) => {

  return (

    <>
    <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50">


    <form onSubmit={HandleFormFunction}
    className=" border-2  bg-white rounded-2xl border-solid  p-8 w-100 h-auto"
    
    >
      <p className="text-center  font-bold mb-3 mt-3">You Win! All Characters found!</p>
      <label htmlFor="username"></label>
      <input
        className="w-fit p-2 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-950"
        name="username"
        placeholder="Username"
        type="text"
        value={value}
        onChange={ (e) => onChange(e.target.value)}
        required
      />


      <p className="text-center m-2 mx-auto font-medium">Your Time: {time}</p>





      <div className="flex justify-center items-center">
        <button
          type="submit"
          className="inline-flex self-start  h-10 mt-2 cursor-pointer mb-7 items-center justify-center rounded-lg bg-blue-500 px-6 font-medium text-white font-poppins transition active:scale-110 "
        >
          Submit Username
        </button>

      
    </div>

      
    </form>
    </div>
    </>


  )

}


export default Form