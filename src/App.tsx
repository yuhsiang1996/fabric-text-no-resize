import React from "react";
import FabricCanvas from "./Components/FabricCanvas";
import FabricTest from "./Components/FabricTest";

import "./styles/global.sass";

const App = () => {
  return (
    <React.StrictMode>
      {/* <FabricCanvas /> */}
      <FabricTest />
    </React.StrictMode>
  );
};

export default App;
