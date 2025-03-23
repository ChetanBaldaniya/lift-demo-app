import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LiftSimulator from "./component/LiftSimulator";

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LiftSimulator />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
