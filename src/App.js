import React, { useState } from "react";
import Navbar from "./components/Navbar";
import TeamTable from "./components/TeamTable";
import TorneoSelector from "./components/TorneoSelector";

function App() {
  const [torneo, setTorneo] = useState("top12");

  return (
    <div>
      <Navbar />
      <TorneoSelector torneo={torneo} onChange={setTorneo} />
      <TeamTable torneo={torneo} />
    </div>
  );
}

export default App;
