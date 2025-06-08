import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { checkInput } from '../service/registerService';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import { API } from '../API.mjs';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { login } = useUser();
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      const { username, password, confirmPassword } = formData;
      try {
        checkInput(username, password, confirmPassword);
        const userData = await API.register(
          username,
          password,
        );
        login(userData);
        navigate("/");
        showSuccess("Registrazione effettuata con successo");
      } catch (error) {
        showError(error.message);
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
                  <h2 style={{ color: '#8b5cf6' }}>🎯 Stuff Happens</h2>
                  <p className="text-muted">Crea un nuovo account</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Scegli un username"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Crea una password"
                    />
                    <Form.Text className="text-muted">
                      Minimo 6 caratteri
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Conferma Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Conferma la password"
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    className="w-100 mb-3"
                    style={{ backgroundColor: '#8b5cf6', border: 'none' }}
                  >
                    Registrati
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="mb-0">
                    Hai già un account?{' '}
                    <Link to="/auth/login" style={{ color: '#8b5cf6' }}>
                      Accedi
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

            {/* Info Box */}
            <Card className="mt-3 border-0" style={{ backgroundColor: '#f8f5ff' }}>
              <Card.Body className="text-center">
                <h6>Perché registrarsi?</h6>
                <ul className="list-unstyled mb-0 text-muted small">
                  <li>✓ Salva la cronologia delle partite</li>
                  <li>✓ Gioca partite complete (6 carte)</li>
                  <li>✓ Visualizza le tue statistiche</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default RegisterPage;