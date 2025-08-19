const { log } = require("console");
const os = require("os");

const osType = os.type() === "Darwin" ? `Mac (${os.type()})` : os.type();
const uptime = os.uptime();
const freeMem = os.freemem();
const totalMem = os.totalmem();
const usedMem = totalMem - freeMem;
const memUseage = Math.floor((usedMem / totalMem) * 100) / 100;
const cpus = os.cpus();
const cpuType = cpus[0].model;
const numCores = cpus.length;
const cpuSpeed = cpus[0].speed;

log({
   osType,
   uptime,
   freeMem,
   totalMem,
   usedMem,
   memUseage,
   cpuType,
   numCores,
   cpuSpeed,
});
