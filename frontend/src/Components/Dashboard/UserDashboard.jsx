import React, { useState, useEffect } from "react";

const UserDashboard = () => {
  const [tournaments, setTournaments] = useState([]); // Danh sách giải đấu
  const [matches, setMatches] = useState([]); // Danh sách lịch thi đấu

  // Mock data cho các giải đấu và trận đấu
  const mockTournaments = [
    {
      id: "1",
      name: "Spring Championship",
      status: "Live",
      venue: "Stadium A",
    },
    { id: "2", name: "Winter Cup", status: "Upcoming", venue: "Stadium B" },
  ];

  const mockMatches = [
    {
      id: "1",
      team1: "Team A",
      team2: "Team B",
      date: "2024-01-15",
      venue: "Stadium A",
    },
    {
      id: "2",
      team1: "Team C",
      team2: "Team D",
      date: "2024-01-16",
      venue: "Stadium B",
    },
    {
      id: "3",
      team1: "Team E",
      team2: "Team F",
      date: "2024-01-17",
      venue: "Stadium C",
    },
  ];

  // Thêm dữ liệu tạm thời vào state khi component được mount
  useEffect(() => {
    setTournaments(mockTournaments);
    setMatches(mockMatches);
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-600"
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/00/46/83/05/360_F_46830569_TLcrV9lfSUQqJthc73qVwGRCG6qnaUPt.jpg')`,
        backgroundSize: 'cover', // Ensures the image covers the entire screen
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed', // Keeps the background fixed when scrolling
        height: '100vh', // Ensures full height
        width: '100vw', // Ensures full width
      }}
    >
      <div className="p-8 backdrop-blur-md bg-white bg-opacity-10 min-h-screen text-white">
        <h1 className="text-4xl font-extrabold text-center mb-8 drop-shadow-lg">
          User Dashboard
        </h1>

        {/* Section: Live Tournaments */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Live Tournaments</h2>
          {tournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg p-6 hover:scale-105 transition-transform"
                >
                  <h3 className="text-xl font-semibold text-gray-100">{tournament.name}</h3>
                  <p className="text-sm text-gray-300">
                    Status:{" "}
                    <span className={`font-medium ${tournament.status === "Live" ? "text-green-400" : "text-yellow-400"}`}>
                      {tournament.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-300">
                    Venue: <span className="font-medium">{tournament.venue}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300">No live tournaments available at the moment.</p>
          )}
        </div>

        {/* Section: Match Schedule */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Match Schedule</h2>
          {matches.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Match</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Venue</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match) => (
                    <tr key={match.id} className="border-b border-gray-600 hover:bg-white hover:bg-opacity-30">
                      <td className="py-3 px-4">{match.team1} vs {match.team2}</td>
                      <td className="py-3 px-4">{match.date}</td>
                      <td className="py-3 px-4">{match.venue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-300">No matches scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
