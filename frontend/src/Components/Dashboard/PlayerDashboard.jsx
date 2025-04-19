import React, { useState, useEffect } from "react";
import axiosClient from "../../utils/axiosClient";
const PlayerDashboard = () => {
  const [playerInfo, setPlayerInfo] = useState({});
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [registeredTournaments, setRegisteredTournaments] = useState([]);

  // Fetch player info and tournaments on load
  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // Fetch player info
        const playerResponse = await axiosClient.get("/v1/user/me");
        setPlayerInfo(playerResponse.data.userInfo);
        const registeredTournamentsData = playerResponse.data.registeredTournaments;
        setRegisteredTournaments(registeredTournamentsData);

        // Fetch available tournaments
        const tournamentsResponse = await axiosClient.get("/v1/tournaments");
        const availableTournaments = tournamentsResponse.data.filter(tournament =>
          !registeredTournamentsData.some(registeredTournament =>
            registeredTournament._id === tournament._id
          )
        );
        setTournaments(availableTournaments);
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };

    fetchPlayerData();
  }, []);

  // Handle tournament registration
  const handleRegisterTournament = async () => {
    try {
      await axiosClient.post(
        "/v1/tournaments/register",
        { tournamentId: selectedTournament },
      );
      alert("Successfully registered for the tournament!");
      // Refresh registered tournaments
      setRegisteredTournaments((prev) => [
        ...prev,
        { ...tournaments.find((t) => t._id === selectedTournament), myRegistrationStatus: "pending" },
      ]);
      setTournaments((prev) => prev.filter((t) => t._id !== selectedTournament));
    } catch (error) {
      console.error("Error registering for tournament:", error);
      alert("Failed to register for the tournament.");
    }
  };

  console.log(playerInfo);


  return (
    <div>
      <h1>Player Dashboard</h1>

      {/* Player Info Section */}
      <h2>Your Information</h2>
      <p>
        <strong>Name:</strong> {playerInfo.fullName}
      </p>
      <p>
        <strong>Address:</strong> {playerInfo.address}
      </p>
      <p>
        <strong>Phone Number:</strong> {playerInfo.phoneNumber}
      </p>
      <p>
        <strong>Date of Birth:</strong> {new Date(playerInfo.dateOfBirth).toLocaleDateString()}
      </p>

      {/* Registered Tournaments Section */}
      <h2>Registered Tournaments</h2>
      {registeredTournaments.length > 0 ? (
        <ul>
          {registeredTournaments.map((tournament) => (
            <li key={tournament.id}>
              {tournament.name} - {tournament.status} - {tournament.myRegistrationStatus}
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
          <option key={tournament._id} value={tournament._id}>
            {tournament.name} - {tournament.status}
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
