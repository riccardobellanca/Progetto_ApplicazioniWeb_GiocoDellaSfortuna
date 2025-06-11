import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import { API } from "../API.mjs";
import { useToast } from "../contexts/ToastContext";
import NavBar from "../components/NavBar";

function GamePage() {
  const [gameData, setGameData] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);

  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const redirectTo = (statusCode) => {
    if (statusCode === 401) navigate("/unauthorized");
    if (statusCode === 403) navigate("/forbidden");
  };

  useEffect(() => {
    startNewGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameData && gameData.status === "in_progress" && !submitting) {
      setTimeLeft(30);
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameData?.round, submitting]);

  const startNewGame = async () => {
    try {
      setLoading(true);
      const data = await API.startGame();
      setGameData(data);
      setSelectedPosition(null);
      setGameEnded(false);
    } catch (err) {
      if (err.code === 500) {
        const mes = err instanceof ApiError ? err.getMessage() : err.message;
        showError(mes);
      } else {
        redirectTo(err.code);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTimeout = async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      setSubmitting(true);
      const result = await API.submitGuess(gameData.gameId, -1);
      processGuessResult(result);
    } catch (err) {
      showError("Errore nel processare il timeout");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitGuess = async () => {
    if (selectedPosition === null || submitting) return;

    if (timerRef.current) clearInterval(timerRef.current);

    try {
      setSubmitting(true);
      const result = await API.submitGuess(gameData.gameId, selectedPosition);
      processGuessResult(result);
    } catch (err) {
      showError("Errore nell'invio della risposta");
    } finally {
      setSubmitting(false);
    }
  };

  const processGuessResult = (result) => {
    setLastResult(result);
    setShowResultModal(true);

    if (result.gameStatus === "won" || result.gameStatus === "lost") {
      setGameEnded(true);
    } else {
      // Aggiorna completamente gameData con i nuovi dati
      setGameData(prevData => ({
        ...prevData,
        round: result.round,
        cardsWon: result.cardsWon,
        cardsLost: result.cardsLost,
        hand: result.hand || prevData.hand,
        challengeCard: result.nextChallengeCard,
        status: result.gameStatus,
      }));
      setSelectedPosition(null);
      setHoveredPosition(null); // Reset anche hoveredPosition
    }
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setLastResult(null); // Pulisci anche lastResult
    
    if (gameEnded) {
      navigate("/");
    } else {
      // Forza un re-render resettando gli stati di interazione
      setSelectedPosition(null);
      setHoveredPosition(null);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const getPositionButtons = () => {
    if (!gameData?.hand) return [];
    const positions = [];
    for (let i = 0; i <= gameData.hand.length; i++) {
      positions.push(i);
    }
    return positions;
  };

  // Funzione corretta per l'animazione delle carte
  const getCardTransform = (cardIndex) => {
    if (hoveredPosition === null) return "translateX(0)";

    // Se il mouse è sopra la posizione a sinistra della carta (posizione cardIndex)
    if (hoveredPosition === cardIndex) {
      return "translateX(20px)"; // La carta si allontana verso destra
    }
    // Se il mouse è sopra la posizione a destra della carta (posizione cardIndex + 1)
    else if (hoveredPosition === cardIndex + 1) {
      return "translateX(-20px)"; // La carta si allontana verso sinistra
    }
    
    return "translateX(0)";
  };

  return (
    <>
      <NavBar />
      <Container
        fluid
        className="game-container"
        style={{ minHeight: "calc(100vh - 56px)", overflowY: "auto", paddingBottom: "20px" }}
      >
        {/* Stats Bar */}
        <Row
          className="stats-bar py-2"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Col>
            <div className="d-flex justify-content-around align-items-center text-white">
              <div className="text-center">
                <i className="bi bi-bullseye fs-5"></i>
                <h6 className="mb-0">Round {gameData?.round || 0}</h6>
              </div>
              <div className="text-center">
                <i className="bi bi-trophy-fill fs-5 text-success"></i>
                <h6 className="mb-0">{gameData?.cardsWon || 0}/6 Carte</h6>
              </div>
              <div className="text-center">
                <i className="bi bi-x-circle-fill fs-5 text-danger"></i>
                <h6 className="mb-0">{gameData?.cardsLost || 0}/3 Errori</h6>
              </div>
              <div className="text-center">
                <i className="bi bi-clock-fill fs-5"></i>
                <h6 className={`mb-0${timeLeft <= 10 ? " text-warning" : ""}`}>
                  {timeLeft}s
                </h6>
              </div>
            </div>
          </Col>
        </Row>

        {/* Game Area */}
        <Row className="game-area">
          <Col className="d-flex flex-column p-3">
            {/* Challenge Card */}
            <div className="challenge-section text-center mb-3">
              <h5 className="mb-2">Dove si colloca questa sfortuna?</h5>
              <Card
                className="challenge-card mx-auto shadow"
                style={{ 
                  maxWidth: "350px", 
                  border: "2px solid #fbbf24",
                  minHeight: "160px"
                }}
              >
                <Card.Body className="d-flex flex-column justify-content-center p-3">
                  <h6 className="card-title mb-2">
                    {gameData?.challengeCard?.name}
                  </h6>
                  <p className="card-text text-muted mb-2 small">
                    {gameData?.challengeCard?.description}
                  </p>
                  {gameData?.challengeCard?.imageUrl && (
                    <div className="text-center">
                      <img
                        src={gameData.challengeCard.imageUrl}
                        alt={gameData.challengeCard.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: "80px", objectFit: "contain" }}
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>

            {/* Hand Cards and Position Buttons */}
            <div className="hand-section d-flex align-items-center justify-content-center mb-3">
              <div
                className="position-container d-flex align-items-center"
                style={{ gap: "10px", flexWrap: "nowrap", overflowX: "auto", padding: "10px 0" }}
              >
                {getPositionButtons().map((pos, idx) => (
                  <React.Fragment key={`pos-${pos}`}>
                    <Button
                      variant={
                        selectedPosition === pos ? "primary" : "outline-primary"
                      }
                      className="position-btn flex-shrink-0"
                      onClick={() => setSelectedPosition(pos)}
                      onMouseEnter={() => setHoveredPosition(pos)}
                      onMouseLeave={() => setHoveredPosition(null)}
                      disabled={submitting}
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        padding: 0,
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        transition: "all 0.3s ease",
                        transform:
                          selectedPosition === pos ? "scale(1.1)" : "scale(1)",
                        zIndex: 10,
                      }}
                    >
                      {pos === 0
                        ? "<"
                        : pos === gameData.hand.length
                        ? ">"
                        : pos}
                    </Button>

                    {idx < gameData.hand.length && (
                      <Card
                        className="hand-card shadow flex-shrink-0"
                        style={{
                          width: "140px",
                          height: "180px",
                          transition: "transform 0.3s ease",
                          transform: getCardTransform(idx),
                          position: "relative",
                        }}
                      >
                        <Card.Body className="p-2 d-flex flex-column position-relative">
                          {/* Badge posizionato correttamente */}
                          <Badge
                            bg={
                              gameData.hand[idx].misfortuneIndex >= 70
                                ? "danger"
                                : gameData.hand[idx].misfortuneIndex >= 40
                                ? "warning"
                                : "success"
                            }
                            className="position-absolute"
                            style={{
                              top: "8px",
                              right: "8px",
                              fontSize: "0.75rem",
                              zIndex: 2
                            }}
                          >
                            {gameData.hand[idx].misfortuneIndex}
                          </Badge>

                          {/* Titolo della carta */}
                          <h6 
                            className="card-title mb-2"
                            style={{
                              paddingRight: "35px", // Spazio per il badge
                              fontSize: "0.85rem",
                              fontWeight: "600",
                              lineHeight: "1.1",
                              minHeight: "35px",
                              display: "flex",
                              alignItems: "flex-start"
                            }}
                          >
                            {gameData.hand[idx].name}
                          </h6>

                          {/* Descrizione */}
                          <p 
                            className="card-text small text-muted flex-grow-1"
                            style={{
                              fontSize: "0.75rem",
                              lineHeight: "1.2",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 6,
                              WebkitBoxOrient: "vertical"
                            }}
                          >
                            {gameData.hand[idx].description}
                          </p>
                        </Card.Body>
                      </Card>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="confirm-section text-center">
              <Button
                variant="success"
                size="lg"
                onClick={handleSubmitGuess}
                disabled={selectedPosition === null || submitting}
                className="px-4 shadow"
                style={{
                  background:
                    selectedPosition !== null
                      ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                      : "",
                  border: "none",
                  minWidth: "200px",
                  height: "45px"
                }}
              >
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Invio...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Conferma
                  </>
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Result Modal - Non chiudibile dall'esterno */}
      <Modal 
        show={showResultModal} 
        onHide={handleCloseResultModal} 
        centered
        backdrop="static"  // Impedisce la chiusura cliccando fuori
        keyboard={false}   // Impedisce la chiusura con ESC
      >
        <Modal.Header
          className={
            lastResult?.success
              ? "bg-success text-white"
              : "bg-danger text-white"
          }
        >
          <Modal.Title>
            <i
              className={`bi bi-${
                lastResult?.success ? "check-circle" : "x-circle"
              } me-2`}
            ></i>
            {lastResult?.success ? "Ottimo!" : "Peccato!"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {lastResult?.success ? (
            <div className="text-center">
              <h5 className="mb-3">Hai indovinato!</h5>
              <p>
                La carta "{lastResult?.cardDetails?.name}" ha un indice di
                sfortuna di{" "}
                <strong>{lastResult?.cardDetails?.misfortuneIndex}</strong>
              </p>
              <p>È stata aggiunta alla tua mano!</p>
            </div>
          ) : (
            <div className="text-center">
              <h5 className="mb-3">Posizione sbagliata!</h5>
              <p>
                La posizione corretta era:{" "}
                <strong>{lastResult?.correctPosition}</strong>
              </p>
              <p>
                L'indice di sfortuna era:{" "}
                <strong>{lastResult?.cardDetails?.misfortuneIndex}</strong>
              </p>
            </div>
          )}

          {lastResult?.gameStatus === "won" && (
            <Alert variant="success" className="mt-3">
              <i className="bi bi-trophy-fill me-2"></i>
              Complimenti! Hai vinto la partita con {lastResult?.cardsWon}{" "}
              carte!
            </Alert>
          )}

          {lastResult?.gameStatus === "lost" && (
            <Alert variant="danger" className="mt-3">
              <i className="bi bi-x-octagon-fill me-2"></i>
              Hai perso! Hai commesso 3 errori.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseResultModal}>
            {gameEnded ? "Torna alla Home" : "Prossimo Round"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GamePage;