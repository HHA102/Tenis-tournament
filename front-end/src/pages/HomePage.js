import React from 'react';
import LiveStream from '../components/LiveStream/LiveStream';
import MatchSchedule from '../components/MatchSchedule/MatchSchedule';

const HomePage = () => {
  return (
    <div>
      <LiveStream />
      <MatchSchedule />
    </div>
  );
};

export default HomePage;

