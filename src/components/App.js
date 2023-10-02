import React, { useState, useEffect, useCallback, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'; 


import "../style/App.css";
import MainNavigation from "../shared/Navigation/MainNavigation";
import createAccountEtudiant from "../formulaire/createAccountEtudiant";
import createAccountEmployeur from "../formulaire/createAccountEmployeur";
import Login from "../formulaire/login";
import listeStage from "../formulaire/listeStage";
import Home from "../formulaire/home";
import CreerStage from "../formulaire/creerStage";
import MyProfile from "../formulaire/myProfile";
import { AuthContext } from "../shared/context/auth-context";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState();
  const auth = useContext(AuthContext);

  const login = useCallback((userId) => {
    console.log(userId)
    setIsLoggedIn(true);
    setUserId(userId);
    auth.updateUserId(userId);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);


  
  
  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, userId:userId, login: login, logout: logout }}
    >
      <Router>
        <MainNavigation />
        <main>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/creerStage" component={CreerStage} />
          <Route path="/listeStage" component={listeStage} />
          <Route path="/createAccountEtudiant" component={createAccountEtudiant} />
          <Route path="/createAccountEmployeur" component={createAccountEmployeur} />
          <Route path="/myProfile" component={MyProfile} />
          <Route path="/login" component={Login} />
        </Switch>  
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
