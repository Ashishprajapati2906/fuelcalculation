import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FuelCalculator from "./components/FuelCalculator";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FuelCalculator />} />
        {/* Aage aur routes add karne ho to yaha karo */}
      </Routes>
    </Router>
  );
};

export default App;
