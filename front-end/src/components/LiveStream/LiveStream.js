import React from 'react';
import './LiveStream.css';

const LiveStream = () => {
  return (
    <div className="live-stream">
      <h2>Live Stream</h2>
      <iframe 
        src="https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID" 
        title="Live Stream"
        width="100%"
        height="400px"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default LiveStream;
