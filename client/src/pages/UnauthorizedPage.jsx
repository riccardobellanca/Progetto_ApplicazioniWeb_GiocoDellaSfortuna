import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

/**
 * Consente di restituire una pagina intuitiva in caso di Unauthorized Error ed eventualmente reindirizzare l'utente al Login
 */
function UnauthorizedPage() {
  return (
    <div
      style={{
        backgroundColor: "#f8f5ff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container className="text-center py-5">
        <h1 className="display-3 fw-bold mb-3" style={{ color: "#8b5cf6" }}>
          🔒 401
        </h1>
        <h2 className="mb-3">Accesso richiesto</h2>
        <p className="text-muted mb-4">
          Devi effettuare l'accesso per visualizzare questa pagina.
        </p>
        <Button
          as={Link}
          to="/auth/login"
          size="lg"
          style={{ backgroundColor: "#8b5cf6", border: "none" }}
        >
          Vai al Login
        </Button>
      </Container>
    </div>
  );
}

export default UnauthorizedPage;
