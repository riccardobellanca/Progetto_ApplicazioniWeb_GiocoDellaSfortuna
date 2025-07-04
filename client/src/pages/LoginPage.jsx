import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useUser } from "../contexts/UserContext";
import { API } from "../API.mjs";
import { checkInput } from "../service/loginService";
import { useToast } from "../contexts/ToastContext";
import { ApiError } from "../API.mjs";

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { showSuccess, showError } = useToast();
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
    try {
      checkInput(username, password);
      const userData = await API.login(
        username,
        password,
      );
      //console.log(userData);
      login(userData);
      navigate("/");
      showSuccess("Login effettuato con successo");
    } catch (error) {
      const mes = error instanceof ApiError ? error.getMessage() : error.message;
      showError(mes);
      
    }
  };
  return (
    <>
      <NavBar />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 style={{ color: "#8b5cf6" }}>🎯 Stuff Happens</h2>
                  <p className="text-muted">Accedi al tuo account</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Inserisci username"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Inserisci password"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 mb-3"
                    style={{ backgroundColor: "#8b5cf6", border: "none" }}
                  >
                    Accedi
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="mb-0">
                    Non hai un account?{" "}
                    <Link to="/auth/register" style={{ color: "#8b5cf6" }}>
                      Registrati
                    </Link>
                  </p>
                </div>

                <hr className="my-4" />

                <div className="text-center">
                  <Link to="/" className="text-decoration-none">
                    <Button variant="outline-secondary" className="w-100">
                      Torna alla Home
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default LoginPage;
