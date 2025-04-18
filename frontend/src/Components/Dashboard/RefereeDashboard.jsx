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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-600"
      style={{
      backgroundImage: `url('https://media.istockphoto.com/id/115967730/photo/female-referee-on-a-clay-tennis-court.jpg?s=612x612&w=0&k=20&c=6mo1nooe9L8tPbjL4rRA7anqp54Jg1nzTXKe8afRcGk=')`,
      backgroundSize: 'cover', // Ensures the image covers the entire screen
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed', // Keeps the background fixed when scrolling
      height: 'auto', // Ensures full height
      width: '100vw', // Ensures full width
    }}>
      <h1>Referee Dashboard</h1>

      {/* Add Match Section */}
      <h2>Add New Match</h2>
      <input
        style={{margin: "auto", display: "block", marginBottom: "7px"}}
        type="text"
        placeholder="Team 1"
        value={newMatch.team1}
        onChange={(e) => setNewMatch({ ...newMatch, team1: e.target.value })}
      />
      <input
        style={{margin: "auto", display: "block", marginBottom: "7px"}}
        type="text"
        placeholder="Team 2"
        value={newMatch.team2}
        onChange={(e) => setNewMatch({ ...newMatch, team2: e.target.value })}
      />
      <input
        style={{margin: "auto", display: "block", marginBottom: "7px"}}
        type="date"
        value={newMatch.date}
        onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
      />
      <input
        style={{margin: "auto", display: "block", marginBottom: "7px"}}
        type="text"
        placeholder="Venue"
        value={newMatch.venue}
        onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
      />
      <button onClick={handleCreateMatch}>Add Match</button>

      {/* Update Score Section */}
      <h2>Update Match Score</h2>
      <select
        style={{margin: "auto", display: "block", marginBottom: "7px"}}
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
        style={{margin: "auto", display: "block", marginBottom: "7px"}}
        type="number"
        placeholder="Team 1 Score"
        value={scores.team1Score}
        onChange={(e) => setScores({ ...scores, team1Score: e.target.value })}
      />
      <input
        style={{margin: "auto", display: "block", marginBottom: "7px"}}
        type="number"
        placeholder="Team 2 Score"
        value={scores.team2Score}
        onChange={(e) => setScores({ ...scores, team2Score: e.target.value })}
      />
      <button style={{margin: "auto", display: "block", marginBottom: "7px"}} onClick={handleUpdateScore} disabled={!scores.matchId}>
        Update Score
      </button>
    </div>
  );
};

export default RefereeDashboard;
