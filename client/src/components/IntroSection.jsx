import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

/**
 * Restituisce una sezione della pagina Home, utile per consentire agli utenti autenticati di giocare e visitare il proprio profilo
 * e agli utenti non autenticati di potersi registrare o provare a giocare una demo
 */
function IntroSection() {
  const { user } = useUser();
  const navigate = useNavigate();
  const handleProfile = () => {
    navigate(`/profile/${user.userId}`);
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f5ff",
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container className="py-5">
        <div className="text-center">
          <h1 className="display-4 fw-bold mb-4">
            <span style={{ color: "#8b5cf6" }}>🎯</span> Stuff Happens
          </h1>
          <p
            className="lead text-muted mb-4"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            Il gioco dove devi indovinare quanto è sfortunata una situazione
            nella vita universitaria! Colleziona 6 carte per vincere, ma attento
            a non fare 3 errori!
          </p>
          <div className="d-flex gap-3 justify-content-center">
            {user ? (
              <>
                <Button
                  as={Link}
                  to="/game"
                  size="lg"
                  style={{ backgroundColor: "#8b5cf6", border: "none" }}
                >
                  ▶ Nuova Partita
                </Button>
                <Button
                  onClick={handleProfile}
                  variant="outline-primary"
                  size="lg"
                  style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}
                >
                  Profilo
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/auth/login"
                  size="lg"
                  style={{ backgroundColor: "#8b5cf6", border: "none" }}
                >
                  ▶ Registrati e Gioca
                </Button>
                <Button
                  as={Link}
                  to="/demo"
                  variant="outline-primary"
                  size="lg"
                  style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}
                >
                  Prova Demo
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default IntroSection;
