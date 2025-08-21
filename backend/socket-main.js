const socketMin = (io) => {
   io.on("connection", (socket) => {
      console.log("Someone connected on worker: " + process.pid);

      const token = socket.handshake.auth.token;
      if (token === "react-client-connection") {
         socket.join("react-client");
      } else if (token === "node-client-connection") {
         socket.join("node-client");
      } else {
         socket.disconnect();
         console.log("Unknown client disconnected");
      }

      socket.emit("welcome", "Welcome to RTP Monitor");

      socket.on("prefData", (data) => {
         io.to("react-client").emit("prefData", data);
      });
   });
};

module.exports = socketMin;
