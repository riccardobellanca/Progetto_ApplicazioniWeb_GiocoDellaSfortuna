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
  const [isTimeout, setIsTimeout] = useState(false);

  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const gameIdRef = useRef(null);

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
    if (gameData?.gameId) {
      gameIdRef.current = gameData.gameId;
    }
  }, [gameData?.gameId]);

  useEffect(() => {
    if (
      gameData &&
      gameData.status === "in_progress" &&
      !submitting &&
      !showResultModal
    ) {
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
  }, [gameData?.round, submitting, showResultModal]);

  const startNewGame = async () => {
    try {
      setLoading(true);
      const data = await API.startGame();
      setGameData(data);
      gameIdRef.current = data.gameId;
      setSelectedPosition(null);
      setGameEnded(false);
      setIsTimeout(false);
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

    const currentGameId = gameIdRef.current;
    if (!currentGameId) {
      console.error("GameId non trovato nel ref!");
      return;
    }

    try {
      setSubmitting(true);
      setIsTimeout(true);
      const result = await API.submitGuess(currentGameId, -1);
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
    const currentGameId = gameIdRef.current;
    if (!currentGameId) {
      console.error("GameId non trovato nel ref!");
      return;
    }

    try {
      setSubmitting(true);
      setIsTimeout(false);
      const result = await API.submitGuess(currentGameId, selectedPosition);
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
      setGameData((prevData) => ({
        ...prevData,
        round: result.round,
        cardsWon: result.cardsWon,
        cardsLost: result.cardsLost,
        hand: result.hand || prevData.hand,
        challengeCard: result.nextChallengeCard,
        status: result.gameStatus,
      }));
      setSelectedPosition(null);
      setHoveredPosition(null);
    }
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);

    if (!gameEnded) {
      setLastResult(null);
      setIsTimeout(false);
      setSelectedPosition(null);
      setHoveredPosition(null);
    }
  };

  const handleNewGame = () => {
    setShowResultModal(false);
    setLastResult(null);
    setIsTimeout(false);
    setGameEnded(false);
    startNewGame();
  };

  const handleBackToHome = () => {
    navigate("/");
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

  const getCardTransform = (cardIndex) => {
    if (hoveredPosition === null) return "translateX(0)";

    if (hoveredPosition === cardIndex) {
      return "translateX(20px)";
    } else if (hoveredPosition === cardIndex + 1) {
      return "translateX(-20px)";
    }

    return "translateX(0)";
  };

  return (
    <>
      <NavBar />
      <Container
        fluid
        className="game-container"
        style={{
          minHeight: "calc(100vh - 56px)",
          overflowY: "auto",
          paddingBottom: "20px",
        }}
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
                  minHeight: "160px",
                }}
              >
                <Card.Body className="d-flex flex-column justify-content-center p-3">
                  <h6 className="card-title mb-2">
                    {gameData?.challengeCard?.name}
                  </h6>
                  {gameData?.challengeCard?.imageUrl && (
                    <div className="text-center">
                      <img
                        src={`http://localhost:5000/images/${gameData?.challengeCard?.imageUrl}`}
                        alt={gameData.challengeCard.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: "160px", objectFit: "contain" }}
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
                style={{
                  gap: "10px",
                  flexWrap: "nowrap",
                  overflowX: "auto",
                  padding: "10px 0",
                }}
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
                          width: "130px",
                          height: "180px",
                          transition: "transform 0.3s ease",
                          transform: getCardTransform(idx),
                          position: "relative",
                          borderRadius: "12px",
                        }}
                      >
                        <Card.Body className="p-2 d-flex flex-column align-items-center justify-content-between">
                          {/* Misfortune index sopra */}
                          <Badge
                            bg={
                              gameData.hand[idx].misfortuneIndex >= 70
                                ? "danger"
                                : gameData.hand[idx].misfortuneIndex >= 40
                                ? "warning"
                                : "success"
                            }
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              borderRadius: "8px",
                            }}
                          >
                            {gameData.hand[idx].misfortuneIndex}
                          </Badge>

                          {/* Immagine della carta */}
                          <div className="text-center my-1">
                            <img
                              src={`http://localhost:5000/images/${gameData.hand[idx].imageUrl}`}
                              alt={gameData.hand[idx].name}
                              className="img-fluid rounded"
                              style={{
                                maxHeight: "80px",
                                objectFit: "contain",
                              }}
                            />
                          </div>

                          {/* Nome della carta */}
                          <h6
                            className="text-center fw-semibold mb-1"
                            style={{
                              fontSize: "0.75rem",
                              color: "#2c3e50",
                              lineHeight: "1.2",
                              textAlign: "center",
                              minHeight: "32px",
                            }}
                          >
                            {gameData.hand[idx].name}
                          </h6>
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
                  height: "45px",
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

      {/* Result Modal */}
      <Modal
        show={showResultModal}
        onHide={handleCloseResultModal}
        centered
        size={gameEnded ? "lg" : "md"}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          className={
            gameEnded
              ? lastResult?.gameStatus === "won"
                ? "bg-success text-white"
                : "bg-danger text-white"
              : isTimeout
              ? "bg-warning text-dark"
              : lastResult?.success
              ? "bg-success text-white"
              : "bg-danger text-white"
          }
        >
          <Modal.Title>
            <i
              className={`bi bi-${
                gameEnded
                  ? lastResult?.gameStatus === "won"
                    ? "trophy-fill"
                    : "x-octagon-fill"
                  : isTimeout
                  ? "clock-history"
                  : lastResult?.success
                  ? "check-circle"
                  : "x-circle"
              } me-2`}
            ></i>
            {gameEnded
              ? lastResult?.gameStatus === "won"
                ? "Hai Vinto!"
                : "Hai Perso!"
              : isTimeout
              ? "Tempo Scaduto!"
              : lastResult?.success
              ? "Ottimo!"
              : "Peccato!"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {gameEnded ? (
            // Fine partita
            <div>
              <div className="text-center mb-4">
                {lastResult?.gameStatus === "won" ? (
                  <>
                    <h4 className="text-success">Complimenti!</h4>
                    <p className="lead">
                      Hai completato la partita vincendo{" "}
                      {lastResult?.cardsWon || 0} carte!
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="text-danger">Partita Terminata</h4>
                    <p className="lead">
                      Hai commesso 3 errori. Hai comunque collezionato{" "}
                      {lastResult?.cardsWon || 0} carte!
                    </p>
                  </>
                )}
              </div>

              {/* Riepilogo carte vinte */}
              {gameData?.hand && gameData.hand.length > 0 && (
                <div>
                  <h5 className="mb-3 text-center">
                    {lastResult?.gameStatus === "won"
                      ? "Riepilogo delle carte vinte:"
                      : "Carte collezionate prima della sconfitta:"}
                  </h5>

                  <Row className="g-3">
                    {/* Mostra le carte in mano */}
                    {gameData.hand.map((card, index) => (
                      <Col key={`hand-${index}`} xs={12} sm={6} md={4}>
                        <Card className="h-100 shadow-sm">
                          <Card.Body className="p-3 d-flex flex-column align-items-center justify-content-between">
                            {/* Misfortune index sopra */}
                            <Badge
                              bg={
                                card.misfortuneIndex >= 70
                                  ? "danger"
                                  : card.misfortuneIndex >= 40
                                  ? "warning"
                                  : "success"
                              }
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                borderRadius: "8px",
                              }}
                            >
                              {card.misfortuneIndex}
                            </Badge>

                            {/* Immagine carta */}
                            <div className="my-2 text-center">
                              <img
                                src={`http://localhost:5000/images/${card.imageUrl}`}
                                alt={card.name}
                                className="img-fluid rounded"
                                style={{
                                  maxHeight: "100px",
                                  objectFit: "contain",
                                }}
                              />
                            </div>

                            {/* Nome carta */}
                            <h6
                              className="text-center fw-semibold mb-1"
                              style={{
                                fontSize: "0.75rem",
                                color: "#2c3e50",
                                lineHeight: "1.2",
                                minHeight: "32px",
                              }}
                            >
                              {card.name}
                            </h6>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}

                    {/* Mostra la challenge card finale solo se ha vinto */}
                    {lastResult?.gameStatus === "won" &&
                      lastResult?.cardDetails && (
                        <Col xs={12} sm={6} md={4}>
                          <Card className="h-100 shadow-sm border-warning">
                            <Card.Body className="p-3 d-flex flex-column align-items-center justify-content-between">
                              {/* Misfortune sopra */}
                              <Badge
                                bg={
                                  lastResult.cardDetails.misfortuneIndex >= 70
                                    ? "danger"
                                    : lastResult.cardDetails.misfortuneIndex >=
                                      40
                                    ? "warning"
                                    : "success"
                                }
                                style={{
                                  fontSize: "0.75rem",
                                  fontWeight: "600",
                                  borderRadius: "8px",
                                }}
                              >
                                {lastResult.cardDetails.misfortuneIndex}
                              </Badge>

                              {/* Immagine carta */}
                              <div className="my-2 text-center">
                                <img
                                  src={`http://localhost:5000/images/${lastResult.cardDetails.imageUrl}`}
                                  alt={lastResult.cardDetails.name}
                                  className="img-fluid rounded"
                                  style={{
                                    maxHeight: "100px",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>

                              {/* Nome carta */}
                              <h6
                                className="text-center fw-semibold mb-1"
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#2c3e50",
                                  lineHeight: "1.2",
                                  minHeight: "32px",
                                }}
                              >
                                {lastResult.cardDetails.name}
                              </h6>
                            </Card.Body>
                          </Card>
                        </Col>
                      )}
                  </Row>
                </div>
              )}

              {/* Messaggio se non ci sono carte */}
              {(!gameData?.hand || gameData.hand.length === 0) && (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-inbox fs-1 mb-3 d-block"></i>
                  <p>Non hai collezionato carte in questa partita.</p>
                </div>
              )}
            </div>
          ) : (
            // Round normale
            <>
              {isTimeout ? (
                <div className="text-center">
                  <h5 className="mb-3">Il tempo è scaduto!</h5>
                  <p>Non hai fatto in tempo a posizionare la carta.</p>
                  <p>
                    La posizione corretta era:{" "}
                    <strong>{lastResult?.correctPosition}</strong>
                  </p>
                </div>
              ) : lastResult?.success ? (
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
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {gameEnded ? (
            <>
              <Button variant="secondary" onClick={handleBackToHome}>
                Torna alla Home
              </Button>
              <Button variant="primary" onClick={handleNewGame}>
                <i className="bi bi-arrow-repeat me-2"></i>
                Nuova Partita
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleCloseResultModal}>
              Prossimo Round
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GamePage;
