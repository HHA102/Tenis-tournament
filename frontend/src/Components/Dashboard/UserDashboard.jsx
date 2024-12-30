import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = () => {
    const [tournaments, setTournaments] = useState([]); // Danh sách giải đấu
    const [matches, setMatches] = useState([]); // Danh sách lịch thi đấu

    // Fetch tournaments and matches on component mount
    useEffect(() => {
        const fetchTournamentsAndMatches = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch tournaments
                const tournamentsResponse = await axios.get('/api/tournaments', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTournaments(tournamentsResponse.data);

                // Fetch matches
                const matchesResponse = await axios.get('/api/matches', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMatches(matchesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTournamentsAndMatches();
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
                            <strong>{tournament.name}</strong> - {tournament.status} - Venue: {tournament.venue}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No live tournaments available at the moment.</p>
            )}

            {/* Section: Match Schedule */}
            <h2>Match Schedule</h2>
            {matches.length > 0 ? (
                <ul>
                    {matches.map((match) => (
                        <li key={match.id}>
                            <strong>{match.team1}</strong> vs <strong>{match.team2}</strong> - Date: {match.date} - Venue: {match.venue}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No matches scheduled.</p>
            )}
        </div>
    );
};

export default UserDashboard;

