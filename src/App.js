import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import { useEffect } from "react";

import liff from "@line/liff";

import MainScreen from "./Components/Main/MainScreen";
import { HOME_DIR } from "./Utills/constants";

function App() {

  useEffect(() => {

    liff.ready.then(() => {
     
    });
  }, []);
  return (
    <Router basename={`${HOME_DIR}`}>
      <Routes>
        <Route exact path="/" element={<MainScreen />} />

      </Routes>
    </Router>
  );
}

export default App;
