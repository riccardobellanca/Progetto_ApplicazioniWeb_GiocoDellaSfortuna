import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useUser } from "../contexts/UserContext";

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useUser();
  const BASE_URL = "";
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Trim degli spazi
    const trimmedData = {
      username: formData.username.trim(),
      password: formData.password.trim(),
    };

    // Validazioni
    if (!trimmedData.username || !trimmedData.password) {
      setError("Tutti i campi sono obbligatori");
      return;
    }
    if (trimmedData.username.length < 4) {
      setError("Username deve avere almeno 3 caratteri");
      return;
    }
    if (trimmedData.password.length < 6) {
      setError("Password deve avere almeno 6 caratteri");
      return;
    }
    // Validazione username (solo lettere, numeri e underscore)
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedData.username)) {
      setError("Username può contenere solo lettere, numeri e underscore");
      return;
    }

     try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const userData = await res.json();
      login(userData);
      navigate("/"); 
    } catch (err) {
      setError(err.message);
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

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Inserisci username"
                      required
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
                      required
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
