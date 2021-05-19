import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import faker from "faker"

const ENDPOINT = "http://localhost:4001";
// const ENDPOINT = "https://1alasdairmackenzie-mousewatcher-2hr8-4001.githubpreview.dev"
function App() {
  const [clientList, setClientList] = useState([]);
  const [socketId, setSocketId] = useState('');
  const [mousePositions, setMousePositions] = useState([]);
  const clientId = faker.name.findName()

  useEffect(async () => {
    const socket = io(ENDPOINT, {
      reconnection: false,
      timeout: 1000
    });

    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    // socket.on("newMessage", (details) => {
    //   console.log(`${details.clientId}: ${details.message}`);
    // });
    // socket.emit("message", { clientId: clientId, message: 'hello!' });

    socket.on("clientListChange", (clientList) => {
      setClientList(clientList)
    });

    socket.on("mousePositionsChanged", (mousePositions) => {
      setMousePositions(mousePositions)
    });

    window.addEventListener('mousemove', (ev) => {
      let mousePos = {
        x: ev.pageX,
        y: ev.pageY
      };

      socket.emit("mouseMove", mousePos);

      console.log(mousePos)
    })
  }, []);

  return (
    <div>
      <p>Connected as: {socketId}</p>
      <h2>Clients:</h2>
      <ul>
        {clientList.map((client) => <li key={client.id}>{client.id}</li>)}
      </ul>
      <h2>Mouse Positions:</h2>
      <ul>
        {mousePositions.map((mousePosition) => <li key={mousePosition.clientId}>{mousePosition.position.x},{mousePosition.position.y}</li>)}
      </ul>

      {mousePositions.map((mousePosition) => 
        <span key={mousePosition.clientId} style={{position : 'absolute', top : mousePosition.position.y, left: mousePosition.position.x}}>
          {mousePosition.clientId}
        </span>)}

    </div>
  );
}

export default App;