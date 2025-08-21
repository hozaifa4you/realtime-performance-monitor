const { log } = require("console");
const os = require("os");
const io = require("socket.io-client");

const options = {
   auth: {
      token: "node-client-connection",
   },
};

const socket = io("http://localhost:3333", options);

socket.on("connect", () => {
   let macA = "";

   const networkInterfaces = os.networkInterfaces();
   for (let key in networkInterfaces) {
      const isInternalFacing = !networkInterfaces[key][0].internal;
      if (isInternalFacing) {
         macA = networkInterfaces[key][0].mac;
         break;
      }
   }

   const perfDataInterval = setInterval(async () => {
      const prefData = await performanceLoadData();
      prefData.mac = macA;

      socket.emit("prefData", prefData);
   }, 1000);

   socket.on("disconnect", () => {
      clearInterval(perfDataInterval);
   });
});

const cupAverage = () =>
   new Promise((resolve, reject) => {
      const cpus = os.cpus();
      let idleMs = 0;
      let totalMs = 0;

      cpus.forEach((core) => {
         for (mode in core.times) {
            totalMs += core.times[mode];
         }

         idleMs += core.times.idle;
      });

      resolve({
         idle: idleMs / cpus.length,
         total: totalMs / cpus.length,
      });
   });

const getCpuLoad = () =>
   new Promise(async (resolve, reject) => {
      const start = await cupAverage();

      setTimeout(async () => {
         const end = await cupAverage();

         const idleDiff = end.idle - start.idle;
         const totalDiff = end.total - start.total;

         const percentOfCpu = 100 - Math.floor((100 * idleDiff) / totalDiff);

         resolve(percentOfCpu);
      }, 100);
   });

const performanceLoadData = () =>
   new Promise(async (resolve, reject) => {
      const osType = os.type() === "Darwin" ? `Mac (${os.type()})` : os.type();
      const uptime = os.uptime();
      const freeMem = os.freemem();
      const totalMem = os.totalmem();
      const usedMem = totalMem - freeMem;
      const memUsage = Math.floor((usedMem / totalMem) * 100) / 100;
      const cpus = os.cpus();
      const cpuType = cpus[0].model;
      const numCores = cpus.length;
      const cpuSpeed = cpus[0].speed;
      const cpuLoad = await getCpuLoad();

      resolve({
         osType,
         uptime,
         freeMem,
         totalMem,
         usedMem,
         memUsage,
         cpuType,
         numCores,
         cpuSpeed,
         cpuLoad,
      });
   });

const run = async () => {
   const data = await performanceLoadData();
   // console.log(data);
};

run();
