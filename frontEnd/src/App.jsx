import { useState, useEffect } from "react";
import "core-js/stable";
import "regenerator-runtime/runtime";
import "./App.css";
import Login from "./componenets/Login/Login";
import useAuth from "./hooks/useAuth";
import DropdownMenu from "./componenets/Menu/DropdownMenu";
import Auth from "./componenets/Incription/Auth";
import Jeu from "./componenets/Jeu/Jeu";
import Displayer from "./componenets/DisplayerView/Display";
import Dashboard from "./componenets/Dasboard/dashboard";
import "bootstrap/dist/css/bootstrap.min.css";

// Définition du composant principal App
function App() {
  // Récupération des éléments nécessaires depuis le hook useAuth
  const {
    user, // Informations sur l'utilisateur
    isAuthenticated, // Statut de l'authentification
    loading, // Indicateur de chargement
    error, // Erreur d'authentification
    login, // Fonction pour se connecter
    logout, // Fonction pour se déconnecter
    checkAuth, // Fonction pour vérifier l'authentification
    register, // Fonction pour s'inscrire
  } = useAuth();

  // État pour gérer la page actuelle affichée
  const [currentPage, setCurrentPage] = useState("page1");

  // Vérification de l'authentification lorsque le composant est monté
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Mise à jour de la page en fonction du statut d'authentification
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage("dashboard"); // Redirige vers le tableau de bord si connecté
    } else {
      setCurrentPage("page1"); // Redirige vers la page de connexion sinon
    }
  }, [isAuthenticated]);

  // Gestion de la connexion, redirige vers le tableau de bord
  const handleLogin = () => {
    setCurrentPage("dashboard");
  };

  // Gestion de la déconnexion, redirige vers la page de connexion et appelle logout
  const handleLogout = () => {
    setCurrentPage("page1");
    logout();
  };

  // Affichage du message de chargement si nécessaire
  if (loading) {
    return <p>Chargement...</p>;
  }

  // Rendu principal du composant App
  return (
    <>
      {/* Menu déroulant pour naviguer entre les pages */}
      <DropdownMenu
        setCurrentPage={setCurrentPage}
        isAuthenticated={isAuthenticated}
      />

      <div className="mc">
        {/* Affichage conditionnel basé sur le statut d'authentification */}
        {isAuthenticated ? (
          <>
            {/* Affichage du tableau de bord si l'utilisateur est sur la page dashboard */}
            {currentPage === "dashboard" && (
              <Dashboard user={user} handleLogout={handleLogout} />
            )}
            {/* Affichage d'autres pages accessibles une fois connecté */}
            {currentPage === "page3" && <Jeu />}
            {currentPage === "displayer" && <Displayer />}
          </>
        ) : (
          <>
            {/* Affichage de la page de connexion si l'utilisateur est sur page1 */}
            {currentPage === "page1" && (
              <Login onLogin={handleLogin} login={login} error={error} />
            )}
            {/* Affichage de la page d'inscription si l'utilisateur est sur page2 */}
            {currentPage === "page2" && <Auth register={register} />}
            {/* Affichage des pages disponibles pour les utilisateurs non connectés */}
            {currentPage === "page3" && <Jeu />}
            {currentPage === "displayer" && <Displayer />}
          </>
        )}
      </div>
    </>
  );
}

// Exportation du composant App pour l'utiliser dans d'autres parties de l'application
export default App;
