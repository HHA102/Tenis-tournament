import React, { useState, useEffect } from "react";
import axios from "axios";

const OrganizerDashboard = () => {
  const [tournamentName, setTournamentName] = useState("");
  const [stadium, setStadium] = useState("");
  const [players, setPlayers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupSize, setGroupSize] = useState(4); // Default group size

  // Fetch list of players
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/players", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlayers(response.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  // Handle creating a new tournament
  const handleAddTournament = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/tournaments",
        { name: tournamentName, stadium },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Tournament added successfully!");
      setTournamentName("");
      setStadium("");
    } catch (error) {
      console.error("Error adding tournament:", error);
      alert("Failed to add tournament.");
    }
  };

  // Handle grouping players
  const handleCreateGroups = () => {
    if (players.length === 0) {
      alert("No players available for grouping.");
      return;
    }
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5); // Shuffle players
    const newGroups = [];
    for (let i = 0; i < shuffledPlayers.length; i += groupSize) {
      newGroups.push(shuffledPlayers.slice(i, i + groupSize));
    }
    setGroups(newGroups);
  };

  return (
    <div>
      <h1>Organizer Dashboard</h1>

      {/* Add Tournament Section */}
      <h2>Add New Tournament</h2>
      <input
        type="text"
        placeholder="Tournament Name"
        value={tournamentName}
        onChange={(e) => setTournamentName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Stadium"
        value={stadium}
        onChange={(e) => setStadium(e.target.value)}
      />
      <button onClick={handleAddTournament}>Add Tournament</button>

      {/* Group Players Section */}
      <h2>Group Players</h2>
      <label>
        Group Size:
        <input
          type="number"
          value={groupSize}
          onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
          min="1"
        />
      </label>
      <button onClick={handleCreateGroups}>Create Groups</button>

      {groups.length > 0 && (
        <div>
          <h3>Generated Groups</h3>
          {groups.map((group, index) => (
            <div key={index}>
              <h4>Group {index + 1}</h4>
              <ul>
                {group.map((player) => (
                  <li key={player.id}>{player.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
