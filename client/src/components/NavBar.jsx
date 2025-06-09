import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useToast } from "../contexts/ToastContext";
import { API } from "../API.mjs";

function NavBar() {
  const { user, logout } = useUser();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.logout();
      logout();
      navigate("/");
      showSuccess("Logout effettuato con successo");
    } catch (error) {
      showError(error.message);
    }
  };

  const handleProfile = () => {
    navigate(`/profile/${user.userId}`);
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
                <Button 
                  variant="outline-secondary" 
                  onClick={handleProfile}
                  className="me-2"
                >
                  Profilo
                </Button>
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