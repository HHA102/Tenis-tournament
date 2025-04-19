import React, { useState, useEffect } from "react";
import axios from "axios";

const SponsorDashboard = () => {
  const [venues, setVenues] = useState([]); // List of venues
  const [matches, setMatches] = useState([]); // List of matches
  const [selectedVenue, setSelectedVenue] = useState(""); // Selected venue ID
  const [selectedMatch, setSelectedMatch] = useState(""); // Selected match ID

  // Fetch available venues and matches
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch venues
        const venuesResponse = await axios.get("/api/venues", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVenues(venuesResponse.data);

        // Fetch matches
        const matchesResponse = await axios.get("/api/matches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatches(matchesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle sponsor confirmation
  const handleConfirmSponsorship = async () => {
    if (!selectedVenue || !selectedMatch) {
      alert("Please select both a venue and a match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/sponsorships",
        { venueId: selectedVenue, matchId: selectedMatch },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Sponsorship confirmed successfully!");
      setSelectedVenue("");
      setSelectedMatch("");
    } catch (error) {
      console.error("Error confirming sponsorship:", error);
      alert("Failed to confirm sponsorship.");
    }
  };

  return (
    <div>
      <h1>Sponsor Dashboard</h1>

      {/* Select Venue Section */}
      <h2>Select a Venue</h2>
      <select
        value={selectedVenue}
        onChange={(e) => setSelectedVenue(e.target.value)}
      >
        <option value="">Choose a venue</option>
        {venues.map((venue) => (
          <option key={venue.id} value={venue.id}>
            {venue.name} - Location: {venue.location}
          </option>
        ))}
      </select>

      {/* Select Match Section */}
      <h2>Select a Match</h2>
      <select
        value={selectedMatch}
        onChange={(e) => setSelectedMatch(e.target.value)}
      >
        <option value="">Choose a match</option>
        {matches.map((match) => (
          <option key={match.id} value={match.id}>
            {match.team1} vs {match.team2} - {match.date}
          </option>
        ))}
      </select>

      {/* Confirm Sponsorship Section */}
      <h2>Confirm Sponsorship</h2>
      <button
        onClick={handleConfirmSponsorship}
        disabled={!selectedVenue || !selectedMatch}
      >
        Confirm Sponsorship
      </button>
    </div>
  );
};

export default SponsorDashboard;
