const cluster = require("cluster");
const http = require("http");
const { Server } = require("socket.io");
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

if (cluster.isPrimary) {
   console.log(`Master ${process.pid} is running`);

   const httpServer = http.createServer();

   // setup master
   setupMaster(httpServer, {
      loadBalancingMethod: "least-connection",
   });

   setupPrimary();

   httpServer.listen(3000);

   for (let i = 0; i < numCPUs.length; i++) {
      cluster.fork();
   }

   cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
      cluster.fork();
   });
} else {
   console.log(`Worker ${process.pid} is running`);

   const httpServer = http.createServer();
   const io = new Server(httpServer);

   io.adapter(createAdapter());
   setupWorker(io);

   io.on("connection", (socket) => {
      console.log("Someone connected on worker: " + process.pid);

      socket.emit("welcome", "Welcome to RTP Monitor");
   });
}
