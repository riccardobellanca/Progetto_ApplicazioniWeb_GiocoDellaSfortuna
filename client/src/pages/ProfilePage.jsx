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
  Collapse,
  Button,
  Accordion,
} from "react-bootstrap";
import { API } from "../API.mjs";
import { useToast } from "../contexts/ToastContext";
import NavBar from "../components/NavBar";
import { ApiError } from "../API.mjs";

function ProfilePage() {
  const { profileId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const { showError } = useToast();
  const navigate = useNavigate();

  const redirectTo = (statusCode) => {
    if (statusCode === 401) navigate("/unauthorized");
    if (statusCode === 403) navigate("/forbidden");
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data = await API.getProfileInfo(profileId);
        setProfileData(data);
        setError(null);
      } catch (err) {
        if (err.code === 500) {
          const mes =
            error instanceof ApiError ? error.getMessage() : error.message;
          showError(mes);
        } else redirectTo(err.code);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const fetchGameHistory = async () => {
    if (gameHistory.length > 0) return; // Già caricata

    try {
      setHistoryLoading(true);
      const data = await API.getProfileHistory(profileId);
      setGameHistory(data);
      setError(null);
    } catch (err) {
      if (err.code === 500) {
        const mes = err instanceof ApiError ? err.getMessage() : err.message;
        showError(mes);
      } else {
        redirectTo(err.code);
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleToggleHistory = () => {
    if (!showHistory && gameHistory.length === 0) {
      fetchGameHistory();
    }
    setShowHistory(!showHistory);
  };

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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
    <>
      <NavBar />
      <Container className="mt-5" style={{ paddingBottom: "4rem" }}>
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
                    <h1
                      className="text-white mb-0"
                      style={{ fontSize: "3rem" }}
                    >
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
                      <small className="text-muted fw-semibold">
                        Sconfitte
                      </small>
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

        {/* Sezione Cronologia Partite */}
        <Card
          className="shadow border-0"
          style={{ marginBottom: showHistory ? "4rem" : "1rem" }}
        >
          <Card.Header className="bg-white border-0">
            <Button
              variant="outline-primary"
              onClick={handleToggleHistory}
              className="w-100 d-flex align-items-center justify-content-between py-3"
              style={{
                border: "none",
                background: "none",
                color: "inherit",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "inherit";
                e.target.style.background = "rgba(0,0,0,0.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "inherit";
                e.target.style.background = "none";
              }}
            >
              <span className="d-flex align-items-center">
                <i className="bi bi-clock-history me-2"></i>
                <strong>Cronologia Partite</strong>
              </span>
              <i
                className={`bi bi-chevron-${showHistory ? "up" : "down"}`}
                style={{
                  fontSize: "1.5rem",
                  color: "#0d6efd",
                  fontWeight: "bold",
                }}
              ></i>
            </Button>
          </Card.Header>

          <Collapse in={showHistory}>
            <div>
              <Card.Body className="p-0" style={{ paddingBottom: "2rem" }}>
                {historyLoading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Caricamento cronologia...</p>
                  </div>
                ) : gameHistory.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-inbox display-1 text-muted mb-3"></i>
                    <p className="text-muted">Nessuna partita trovata</p>
                  </div>
                ) : (
                  <div style={{ padding: "1rem" }}>
                    <Accordion flush>
                      {gameHistory.map((game, gameIndex) => (
                        <Accordion.Item
                          key={game.gameId}
                          eventKey={gameIndex.toString()}
                        >
                          <Accordion.Header>
                            <div className="d-flex align-items-center justify-content-between w-100 me-3">
                              <div className="d-flex align-items-center">
                                <i className="bi bi-controller me-3 text-primary"></i>
                                <div>
                                  <strong>Partita #{game.gameId}</strong>
                                  <br />
                                  <small className="text-muted">
                                    {formatDateTime(game.createdAt)}
                                  </small>
                                </div>
                              </div>
                              <div className="text-end">
                                <Badge
                                  bg={
                                    game.status === "won"
                                      ? "success"
                                      : "danger"
                                  }
                                  className="mb-1"
                                >
                                  {game.status === "won" ? "Vinta" : "Persa"}
                                </Badge>
                                <br />
                                <small className="text-muted">
                                  <span className="text-success me-2">
                                    <i className="bi bi-trophy"></i>{" "}
                                    {game.totalCardsWon-3}
                                  </span>
                                  <span className="text-danger">
                                    <i className="bi bi-x-circle"></i>{" "}
                                    {game.totalCardsLost}
                                  </span>
                                </small>
                              </div>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body
                            className="bg-light"
                            style={{ paddingBottom: "2rem" }}
                          >
                            <Row className="g-3">
                              {game.rounds.map((round, roundIndex) => (
                                <Col key={roundIndex} lg={6} xl={4}>
                                  <Card
                                    className={`h-100 border-0 shadow-sm ${
                                      round.isWon
                                        ? "border-success"
                                        : "border-danger"
                                    }`}
                                    style={{
                                      borderLeft: `4px solid ${
                                        round.isWon ? "#22c55e" : "#ef4444"
                                      } !important`,
                                    }}
                                  >
                                    <Card.Body className="p-3 d-flex flex-column align-items-center justify-content-between">
                                      <Badge
                                        variant="outline"
                                        className="px-3 py-1.5 border-gray-300 bg-white text-black text-base mb-2"
                                      >
                                        Round {round.roundNumber}
                                      </Badge>

                                      {/* Immagine della carta */}
                                      {round.card.imageUrl && (
                                        <img
                                          src={`http://localhost:5000/images/${round.card.imageUrl}`}
                                          alt={round.card.name}
                                          style={{
                                            maxHeight: "100px",
                                            objectFit: "contain",
                                          }}
                                        />
                                      )}

                                      {/* Nome carta */}
                                      <h6 className="text-center mb-2">
                                        {round.card.name}
                                      </h6>

                                      {/* Esito del round */}
                                      <div className="text-center">
                                        <div
                                          className={`badge mb-1 ${
                                            round.roundNumber === 0
                                              ? "bg-secondary text-white" // neutro (grigio)
                                              : round.isWon
                                              ? "bg-success"
                                              : "bg-danger"
                                          }`}
                                        >
                                          <i
                                            className={`bi me-1 ${
                                              round.roundNumber === 0
                                                ? "bi-hand" // icona mano
                                                : round.isWon
                                                ? "bi-check-circle"
                                                : "bi-x-circle"
                                            }`}
                                          ></i>
                                          {round.roundNumber === 0
                                            ? "In mano"
                                            : round.isWon
                                            ? "Vinta"
                                            : "Persa"}
                                        </div>
                                      </div>
                                    </Card.Body>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </div>
                )}
              </Card.Body>
            </div>
          </Collapse>
        </Card>
      </Container>
    </>
  );
}

export default ProfilePage;
