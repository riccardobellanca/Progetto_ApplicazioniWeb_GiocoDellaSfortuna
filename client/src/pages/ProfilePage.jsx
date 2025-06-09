import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import { API } from "../API.mjs";
import { useToast } from "../contexts/ToastContext";

function ProfilePage() {
  const { profileId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useToast();
  const navigate = useNavigate();

  const redirectTo = (statusCode) => {
    if (statusCode === 401) navigate("/unauthorized");
    if (statusCode === 403) navigate("/forbidden");
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data = await API.getProfileInfo(profileId);
        setProfileData(data);
        setError(null);
      } catch (err) {
        if (err.code === 500) showError(err.message);
        else redirectTo(err.code);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Profilo non trovato</Alert>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getWinRateColor = (rate) => {
    if (rate >= 70) return "#22c55e";
    if (rate >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const winRate = parseFloat(profileData.winRate);
  const lossRate = 100 - winRate;

  return (
    <Container className="mt-5">
      <Row>
        <Col lg={4} className="mb-4">
          <Card
            className="shadow border-0 h-100"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <Card.Body className="text-center text-white py-5">
              <div className="mb-4">
                <div
                  className="rounded-circle bg-white bg-opacity-25 d-inline-flex align-items-center justify-content-center shadow-lg"
                  style={{
                    width: "100px",
                    height: "100px",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <h1 className="text-white mb-0" style={{ fontSize: "3rem" }}>
                    {profileData.username.charAt(0).toUpperCase()}
                  </h1>
                </div>
              </div>
              <h2 className="mb-3">{profileData.username}</h2>
              <Badge bg="light" text="dark" className="px-3 py-2">
                <i className="bi bi-calendar3 me-2"></i>
                Giocatore dal {formatDate(profileData.createdAt)}
              </Badge>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow border-0 mb-4">
            <Card.Header className="bg-white border-0 pt-4 pb-3">
              <h4 className="mb-0 d-flex align-items-center">
                <i
                  className="bi bi-bar-chart-line me-2"
                  style={{ color: "#8b5cf6" }}
                ></i>
                Statistiche di Gioco
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="g-4">
                <Col sm={6} md={3}>
                  <div
                    className="text-center p-3 rounded"
                    style={{ backgroundColor: "#f3f4f6" }}
                  >
                    <i className="bi bi-controller display-6 text-primary mb-2 d-block"></i>
                    <h3 className="mb-1">{profileData.games.gamesPlayed}</h3>
                    <small className="text-muted fw-semibold">
                      Partite Giocate
                    </small>
                  </div>
                </Col>
                <Col sm={6} md={3}>
                  <div
                    className="text-center p-3 rounded"
                    style={{ backgroundColor: "#f0fdf4" }}
                  >
                    <i className="bi bi-trophy display-6 text-success mb-2 d-block"></i>
                    <h3 className="mb-1">{profileData.games.gamesWon}</h3>
                    <small className="text-muted fw-semibold">Vittorie</small>
                  </div>
                </Col>
                <Col sm={6} md={3}>
                  <div
                    className="text-center p-3 rounded"
                    style={{ backgroundColor: "#fef2f2" }}
                  >
                    <i className="bi bi-x-circle display-6 text-danger mb-2 d-block"></i>
                    <h3 className="mb-1">{profileData.games.gamesLost}</h3>
                    <small className="text-muted fw-semibold">Sconfitte</small>
                  </div>
                </Col>
                <Col sm={6} md={3}>
                  <div
                    className="text-center p-3 rounded"
                    style={{ backgroundColor: "#faf5ff" }}
                  >
                    <i
                      className="bi bi-percent display-6 mb-2 d-block"
                      style={{ color: "#8b5cf6" }}
                    ></i>
                    <h3
                      className="mb-1"
                      style={{ color: getWinRateColor(winRate) }}
                    >
                      {profileData.winRate}%
                    </h3>
                    <small className="text-muted fw-semibold">Win Rate</small>
                  </div>
                </Col>
              </Row>

              <div className="mt-5">
                <h6 className="mb-3">Distribuzione Vittorie/Sconfitte</h6>
                <ProgressBar style={{ height: "25px" }}>
                  <ProgressBar
                    variant="success"
                    now={winRate}
                    label={`${winRate}%`}
                    style={{ fontSize: "0.9rem" }}
                  />
                  <ProgressBar
                    variant="danger"
                    now={lossRate}
                    label={`${lossRate}%`}
                    style={{ fontSize: "0.9rem" }}
                  />
                </ProgressBar>
              </div>

              {profileData.games.datelastGame && (
                <div className="mt-4 pt-4 border-top">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted">
                      <i className="bi bi-clock-history me-2"></i>
                      Ultima partita
                    </span>
                    <Badge bg="secondary" className="px-3 py-2">
                      {formatDate(profileData.games.datelastGame)}
                    </Badge>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
