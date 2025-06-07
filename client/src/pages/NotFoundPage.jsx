import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

function NotFoundPage() {
  return (
    <div style={{ backgroundColor: "#f8f5ff", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Container className="text-center py-5">
        <h1 className="display-3 fw-bold mb-3" style={{ color: "#8b5cf6" }}>
          🎯 404
        </h1>
        <h2 className="mb-3">Oops! Pagina non trovata</h2>
        <p className="text-muted mb-4">
          La pagina che cerchi potrebbe essere stata rimossa, rinominata o non è mai esistita.
        </p>
        <Button
          as={Link}
          to="/"
          size="lg"
          style={{ backgroundColor: "#8b5cf6", border: "none" }}
        >
          Torna alla Home
        </Button>
      </Container>
    </div>
  );
}

export default NotFoundPage;
