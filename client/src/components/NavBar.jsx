import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function NavBar() {
  const { user, logout } = useUser();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <span style={{ color: "#8b5cf6" }}>🎯 Stuff Happens</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {!user ? (
              <>
                <Nav.Link as={Link} to="/auth/login">
                  Accedi
                </Nav.Link>
                <Nav.Link as={Link} to="/auth/register">
                  Registrati
                </Nav.Link>
              </>
            ) : (
              <>
                <span className="me-3">Bentornato, <strong>{user.username}</strong></span>
                <Button variant="outline-primary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;