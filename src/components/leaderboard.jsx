const Leaderboard = ( {leaderboardData} ) => {
  return (
    <>
    <main>
      <div className="max-w-7xl">
        <h1 className="text-2xl font-bold text-center mb-6">Leaderboard</h1>
        <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((data, index) => {
            <tr>
              <td> {index + 1} </td>
              <td> {data.name} </td>
              <td> {data.time} </td>
            </tr>
          })}
          </tbody>
        </table>
      </div>

    </main>
    
    </>
  )

}


export default Leaderboard;


// use index for number?