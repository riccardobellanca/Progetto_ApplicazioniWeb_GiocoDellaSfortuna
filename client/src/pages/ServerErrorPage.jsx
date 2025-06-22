import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

/**
 * Consente di restituire una pagina intuitiva in caso di Internal Server Error ed eventualmente reindirizzare l'utente alla Home o ricaricare la pagina
 */
function ServerErrorPage() {
  return (
    <div style={{ backgroundColor: "#f8f5ff", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Container className="text-center py-5">
        <h1 className="display-3 fw-bold mb-3" style={{ color: "#8b5cf6" }}>
          ⚠️ 500
        </h1>
        <h2 className="mb-3">Errore del server</h2>
        <p className="text-muted mb-4">
          Si è verificato un problema tecnico. Riprova tra qualche minuto.
        </p>
        <Button
          as={Link}
          to="/"
          size="lg"
          style={{ backgroundColor: "#8b5cf6", border: "none" }}
          className="me-3"
        >
          Torna alla Home
        </Button>
        <Button
          variant="outline-secondary"
          size="lg"
          onClick={() => window.location.reload()}
        >
          Ricarica la pagina
        </Button>
      </Container>
    </div>
  );
}

export default ServerErrorPage;