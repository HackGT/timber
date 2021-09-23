import React from "react";
import { io } from "socket.io-client";

const Dashboard: React.FC = () => {
  const hi = "hi";
  const socket = io(`http://localhost:3000/`); 
  socket.connect()
  return (
    <div style={{ height: "500px" }}>
      <p>hi</p>
    </div>
  );
};

export default Dashboard;
