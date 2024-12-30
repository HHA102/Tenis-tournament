import React, { useState, useEffect } from "react";
import axios from "axios";

const RefereeDashboard = () => {
  const [matches, setMatches] = useState([]);
  const [newMatch, setNewMatch] = useState({
    team1: "",
    team2: "",
    date: "",
    venue: "",
  });
  const [scores, setScores] = useState({
    matchId: "",
    team1Score: "",
    team2Score: "",
  });

  // Fetch all matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/matches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatches(response.data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, []);

  // Handle creating a new match
  const handleCreateMatch = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/matches", newMatch, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Match added successfully!");
      setNewMatch({ team1: "", team2: "", date: "", venue: "" });
    } catch (error) {
      console.error("Error adding match:", error);
      alert("Failed to add match.");
    }
  };

  // Handle updating match score
  const handleUpdateScore = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/matches/${scores.matchId}/score`,
        { team1Score: scores.team1Score, team2Score: scores.team2Score },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Score updated successfully!");
      setScores({ matchId: "", team1Score: "", team2Score: "" });
    } catch (error) {
      console.error("Error updating score:", error);
      alert("Failed to update score.");
    }
  };

  return (
    <div>
      <h1>Referee Dashboard</h1>

      {/* Add Match Section */}
      <h2>Add New Match</h2>
      <input
        type="text"
        placeholder="Team 1"
        value={newMatch.team1}
        onChange={(e) => setNewMatch({ ...newMatch, team1: e.target.value })}
      />
      <input
        type="text"
        placeholder="Team 2"
        value={newMatch.team2}
        onChange={(e) => setNewMatch({ ...newMatch, team2: e.target.value })}
      />
      <input
        type="date"
        value={newMatch.date}
        onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
      />
      <input
        type="text"
        placeholder="Venue"
        value={newMatch.venue}
        onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
      />
      <button onClick={handleCreateMatch}>Add Match</button>

      {/* Update Score Section */}
      <h2>Update Match Score</h2>
      <select
        value={scores.matchId}
        onChange={(e) => setScores({ ...scores, matchId: e.target.value })}
      >
        <option value="">Select a match</option>
        {matches.map((match) => (
          <option key={match.id} value={match.id}>
            {match.team1} vs {match.team2} - {match.date}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Team 1 Score"
        value={scores.team1Score}
        onChange={(e) => setScores({ ...scores, team1Score: e.target.value })}
      />
      <input
        type="number"
        placeholder="Team 2 Score"
        value={scores.team2Score}
        onChange={(e) => setScores({ ...scores, team2Score: e.target.value })}
      />
      <button onClick={handleUpdateScore} disabled={!scores.matchId}>
        Update Score
      </button>
    </div>
  );
};

export default RefereeDashboard;
