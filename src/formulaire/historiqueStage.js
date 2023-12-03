import React, { useContext, useEffect, useState } from 'react';
import { useHttpClient } from "../shared/hooks/http-hook";
import { AuthContext } from '../shared/context/auth-context';
import './historiqueStage.css'; // Import the CSS file

const HistoriqueStage = () => {
    const { sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);
    const userId = auth.userId;
    const [stages, setStages] = useState([]);
    const [listeStage, setListeStage] = useState([]);

    useEffect(() => {
        const fetchEtudiantStages = async () => {
            try {
                const responseData = await sendRequest(`https://backend-2h23.onrender.com/stage/`);
                setStages(responseData.stages);
            } catch (error) {
                console.error('Erreur lors de la récupération des stages :', error);
            }
        };

        fetchEtudiantStages();
    }, [sendRequest]);

    useEffect(() => {
        const creerListeStage = () => {
            const updatedListeStage = [];
            stages.forEach(stage => {
                const { etudiants, dateEtudiants, statut, nom } = stage;
                etudiants.forEach((etudiantId, index) => {
                    if (userId === etudiantId) {
                        updatedListeStage.push({
                            nom: nom,
                            date: dateEtudiants[index],
                            statut: statut[index]
                        });
                    }
                });
            });
            setListeStage(updatedListeStage);
        };

        if (stages.length > 0) {
            creerListeStage();
        }
    }, [stages, userId]);

    const getStatusClassName = (statut) => {
        switch (statut) {
            case 'Accepter':
                return 'accepted';
            case 'Refuser':
                return 'refused';
            case 'En attente':
                return 'en-attente';
            default:
                return '';
        }
    };

    return (
        <ul>
            {listeStage.map((stage, stageIndex) => (
                <div className="stageContainer" key={stageIndex}>
                    <p className="stageName">{stage.nom}</p>
                    <p className="stageDate">{stage.date}</p>
                    <p className={`stageStatus ${getStatusClassName(stage.statut)}`}>
                        {stage.statut}
                    </p>
                </div>
            ))}
        </ul>
    );
};

export default HistoriqueStage;
