import React, { useState, useEffect } from "react";
import axios from "axios";

const PlayerDashboard = () => {
  const [playerInfo, setPlayerInfo] = useState({});
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [registeredTournaments, setRegisteredTournaments] = useState([]);

  // Fetch player info and tournaments on load
  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch player info
        const playerResponse = await axios.get("/api/players/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlayerInfo(playerResponse.data);

        // Fetch available tournaments
        const tournamentsResponse = await axios.get("/api/tournaments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTournaments(tournamentsResponse.data);

        // Fetch registered tournaments
        const registeredResponse = await axios.get(
          "/api/players/registered-tournaments",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRegisteredTournaments(registeredResponse.data);
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };

    fetchPlayerData();
  }, []);

  // Handle tournament registration
  const handleRegisterTournament = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/tournaments/register",
        { tournamentId: selectedTournament },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Successfully registered for the tournament!");
      // Refresh registered tournaments
      setRegisteredTournaments((prev) => [
        ...prev,
        tournaments.find((t) => t.id === selectedTournament),
      ]);
    } catch (error) {
      console.error("Error registering for tournament:", error);
      alert("Failed to register for the tournament.");
    }
  };

  return (
    <div>
      <h1>Player Dashboard</h1>

      {/* Player Info Section */}
      <h2>Your Information</h2>
      <p>
        <strong>Name:</strong> {playerInfo.name}
      </p>
      <p>
        <strong>Username:</strong> {playerInfo.username}
      </p>
      <p>
        <strong>Age:</strong> {playerInfo.age}
      </p>
      <p>
        <strong>Rank:</strong> {playerInfo.rank}
      </p>

      {/* Registered Tournaments Section */}
      <h2>Registered Tournaments</h2>
      {registeredTournaments.length > 0 ? (
        <ul>
          {registeredTournaments.map((tournament) => (
            <li key={tournament.id}>
              {tournament.name} - {tournament.date}
            </li>
          ))}
        </ul>
      ) : (
        <p>You have not registered for any tournaments yet.</p>
      )}

      {/* Tournament Registration Section */}
      <h2>Register for a Tournament</h2>
      <select
        value={selectedTournament}
        onChange={(e) => setSelectedTournament(e.target.value)}
      >
        <option value="">Select a tournament</option>
        {tournaments.map((tournament) => (
          <option key={tournament.id} value={tournament.id}>
            {tournament.name} - {tournament.date}
          </option>
        ))}
      </select>
      <button onClick={handleRegisterTournament} disabled={!selectedTournament}>
        Register
      </button>
    </div>
  );
};

export default PlayerDashboard;
