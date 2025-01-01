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
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>

      {/* Section: Live Tournaments */}
      <h2>Live Tournaments</h2>
      {tournaments.length > 0 ? (
        <ul>
          {tournaments.map((tournament) => (
            <li key={tournament.id}>
              <strong>{tournament.name}</strong> - {tournament.status} - Venue:{" "}
              {tournament.venue}
            </li>
          ))}
        </ul>
      ) : (
        <p>No live tournaments available at the moment.</p>
      )}

      {/* Section: Match Schedule */}
      <h2>Match Schedule</h2>
      {matches.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Match</th>
              <th>Date</th>
              <th>Venue</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id}>
                <td>
                  <strong>{match.team1}</strong> vs{" "}
                  <strong>{match.team2}</strong>
                </td>
                <td>{match.date}</td>
                <td>{match.venue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No matches scheduled.</p>
      )}
    </div>
  );
};

export default UserDashboard;
