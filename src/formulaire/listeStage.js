import { Link } from 'react-router-dom';
import { useHttpClient } from "../shared/hooks/http-hook";
import { useForm } from "../shared/hooks/form-hook";
import { AuthContext } from '../shared/context/auth-context';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import style from './liste.css';


const ListeStage = () => {
  const { error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const [stages, setStages] = useState([]);
  const [userType, setUserType] = useState("");
  const history = useHistory();

  let utilisateur;

  const handleSumbitClick = (stageId) => {
    history.push('/stageDetails', { prop1: stageId});
  };

  const handleSumbitPostuler = (stageId) => {
    history.push('/postuler', { prop1: stageId});
  };

  useEffect(() => {
    const fetchUtilisateur = async () => {
      try {
        const reponseData = await sendRequest(`http://localhost:5000/etudiant/${userId}`);
        if (reponseData.success) {
          setUserType(reponseData.etudiant.userType);
        } else {
          const reponseData = await sendRequest(`http://localhost:5000/employeur/${userId}`);
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
    useEffect(() => {

      const fetchEmployerStages = async () => {
        try {
          console.log("intérieur Employeur")
          const reponseData = await sendRequest(`http://localhost:5000/stage/getStages/${userId}`);
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
          const reponseData = await sendRequest(`http://localhost:5000/stage/`);
          setStages(reponseData.stages);


        } catch (error) {
          console.error('Erreur lors de la récupération des stages :', error);
        }
      };

      if(userType == "etudiant") {
      fetchEtudiantStages();
      }
    });


  



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
            <Link to={{
              pathname: '/stageDetails',
              state: stage
              }} className="stage-link">
            <div className="form-groupS" key={stage.id}>
              <h2 className="nom">{stage.nom}</h2>
              <p><strong>{stage.nomEntreprise}</strong></p>
              <p>Adresse de lentreprise : {stage.adresseEntreprise}</p>
              <p>Type de stage : {stage.typeStage}</p>
              <p>Rémunération : {stage.remuneration}</p>
              <p>Numero employeur: {stage.numeroTel}</p>
              {userType === "etudiant" && (
                
                <button type="submit" onClick={() => handleSumbitPostuler(stage.id)}>Détails</button>

              )
              }
            </div>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListeStage;
