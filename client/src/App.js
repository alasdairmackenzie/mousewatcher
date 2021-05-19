import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:4001";
// const ENDPOINT = "https://1alasdairmackenzie-mousewatcher-2hr8-4001.githubpreview.dev"
function App() {
  const [response, setResponse] = useState("");
  const roomId = '123';

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT, {
      reconnection: false,
      timeout: 1000
    });

    socket.on("connect", () => {
      console.log(`connected`);
    });

    socket.on("newJoiner", ()=> {
      console.log(`newJoiner`);
    })

    socket.emit("joinRoom", { 'roomId' : roomId});
  }, []);

  return (
    <p>
      It's <time dateTime={response}>{response}</time>
    </p>
  );
}

export default App;