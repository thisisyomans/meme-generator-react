import React from 'react';
import { Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import Home from "./Home";
import Generator from "./Generator";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route exact="true" path="/" element={
          <div className="container-home">
            <div className="inner-home">  
              <Home />
            </div>
          </div>
        } />
        <Route exact="true" path="/generator" element={
          <div className="container-generator">
            <Generator />
          </div>
        } />
        <Route exact="true" path="*" />
      </Routes>
    </>
  );
}

export default App;
