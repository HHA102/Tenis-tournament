import React from 'react';
import './MatchSchedule.css';

const MatchSchedule = () => {
  const matches = [
    { date: '2024-12-18', match: 'Player A vs Player B', time: '10:00 AM' },
    { date: '2024-12-19', match: 'Player C vs Player D', time: '02:00 PM' },
    { date: '2024-12-20', match: 'Player E vs Player F', time: '06:00 PM' },
  ];

  return (
    <div className="match-schedule">
      <h2>Match Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Match</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr key={index}>
              <td>{match.date}</td>
              <td>{match.match}</td>
              <td>{match.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchSchedule;
