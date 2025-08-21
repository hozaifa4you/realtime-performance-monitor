export interface PrefDataType {
   cpuLoad: number;
   cpuSpeed: number;
   cpuType: "Intel(R) Core(TM) i5-5257U CPU @ 2.70GHz";
   freeMem: number;
   mac: string;
   memUsage: number;
   numCores: number;
   osType: string;
   totalMem: number;
   uptime: number;
   usedMem: number;
}

export interface PerformanceData {
   [key: string]: PrefDataType;
}
