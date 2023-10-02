import { Link } from 'react-router-dom';
import { useHttpClient } from "../shared/hooks/http-hook";
import { useForm } from "../shared/hooks/form-hook";
import { AuthContext } from '../shared/context/auth-context';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import style from './liste.css';


const ListeStage = () => {
  const { error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const typeUser = auth.typeUser;
  const [stages, setStages] = useState([]);
  const [userType, setUserType] = useState("");
  const history = useHistory();

  let utilisateur;

  useEffect(() => {
    const fetchUtilisateur = async () => {
      try {
        const reponseData = await sendRequest(process.env.REACT_APP_BACKEND_URL +`  etudiant/${userId}`);
        if (reponseData.success) {
          setUserType(reponseData.etudiant.userType);
        } else {
          const reponseData = await sendRequest(process.env.REACT_APP_BACKEND_URL +`  employeur/${userId}`);
          if (reponseData.success) {
            setUserType(reponseData.employeur.userType); ``
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
    useEffect(() => {

      const fetchEmployerStages = async () => {
        try {
          console.log("intérieur Employeur")
          const reponseData = await sendRequest(process.env.REACT_APP_BACKEND_URL +`  stage/getStages/${userId}`);
          console.log(reponseData.stages.length);
          setStages(reponseData.stages);

        } catch (error) {
          console.error('Erreur lors de la récupération des stages :', error);
        }
      };

      if(userType == "employeur") {
      fetchEmployerStages();
      }
    });
  
    useEffect(() => {

      const fetchEtudiantStages = async () => {
        try {
          console.log("intérieur étudiant")
          const reponseData = await sendRequest(process.env.REACT_APP_BACKEND_URL +`  stage/`);
          console.log(reponseData.stages.length);
          setStages(reponseData.stages);
          console.log("setted");

        } catch (error) {
          console.error('Erreur lors de la récupération des stages :', error);
        }
      };

      if(userType == "etudiant") {
      fetchEtudiantStages();
      }
    });


    console.log(stages);
  



  return (
    <div>
      <h1>Liste des stages disponibles</h1>
      {stages.length === 0 ? (
        <div>
          <p>Aucun stage disponible.</p>

        </div>
      ) : (
        <ul>
          {stages.map((stage) => (
            <div className="form-groupS">
            <li key={stage.id}>{stage.nomStage}
              <h2>{stage.nomStage}</h2>
              <p>Nom de l'entreprise : {stage.nomEntreprise}</p>
              <p>Type de stage : {stage.typeStage}</p>
              <p>Rémunération : {stage.remuneration}</p></li>
              </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListeStage;
