import React from "react";
import FabricCanvas from "./Components/FabricCanvas";
import FabricTest from "./Components/FabricTest";
import ReactAdvancedCropper from "./Components/ReactAdvancedCropper";

import "./styles/global.sass";

const App = () => {
  return (
    <React.StrictMode>
      <ReactAdvancedCropper />
    </React.StrictMode>
  );
};

export default App;
