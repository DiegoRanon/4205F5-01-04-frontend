import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import {useHistory} from 'react-router-dom';



import "./NavLinks.css";

function NavLinks(props) {
  const history = useHistory();
  const { error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const [userType, setUserType] = useState("");
  let utilisateur;

  useEffect(() => {
    const fetchUtilisateur = async () => {
      try {

      
        const reponseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `etudiant/${userId}`);
        if (reponseData.success) {
          setUserType(reponseData.etudiant.userType);
        } else {
          const reponseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `employeur/${userId}`);
          if (reponseData.success) {
            setUserType(reponseData.employeur.userType);
          }
        }
      } catch (err) {
        console.log("Error fetching user data:", err);
      }
    };

    if (auth.isLoggedIn) {
      fetchUtilisateur();
    }
  }, [auth.isLoggedIn, userId, sendRequest]);



  const deconnection = async () => {
    try {
      await auth.logout(); 
      history.push('/home'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/home" exact>
          Home
        </NavLink>
      </li>
      {(auth.isLoggedIn) && (
        <li>
          <NavLink to="/listeStage">Liste Stages</NavLink>
        </li>
      )}
      {(auth.isLoggedIn && userType === "employeur") && (
        <li>
          <NavLink to="/creerStage">Créer Stages</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/myProfile">Profile</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <button onClick={deconnection}>Déconnexion</button>
        </li>
      )}
    </ul>
  );
}

export default NavLinks;
