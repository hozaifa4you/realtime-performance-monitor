import { io } from "socket.io-client";

const options = {
   auth: {
      token: "react-client-connection",
   },
};

const socket = io("http://localhost:3333", options);
socket.on("welcome", (message) => {
   console.log({ message });
});

export default socket;
