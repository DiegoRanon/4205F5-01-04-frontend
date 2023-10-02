import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHttpClient } from "../shared/hooks/http-hook";
import { useForm } from "../shared/hooks/form-hook";

function Home(props) {

    return (
        <div className="container">
            <h2>Page d'accueil</h2>
            <p> Gérer de manière efficace le processus de stage d’un étudiant et du milieu de stage</p>
            
        </div>
    );
    
}

export default Home;