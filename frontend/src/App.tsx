import { useEffect, useState } from "react";
import socket from "./socketConnection";
import type { PerformanceData, PrefDataType } from "./types/perfData";

function App() {
   const [performanceData, setPerformanceData] = useState<PerformanceData>({});

   useEffect(() => {
      socket.on("prefData", (data: PrefDataType) => {
         const performanceCopy: { [key: string]: PrefDataType } = {
            ...performanceData,
         };
         performanceCopy[data.mac] = data;

         setPerformanceData(performanceCopy);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   console.log(performanceData);

   return (
      <div className="container">
         <h1>RTP Monitor</h1>
      </div>
   );
}

export default App;
