import { Row, Col, Card } from 'react-bootstrap';

/**
 * Restituisce una sommario delle regole e dell'obiettivo del gioco
 */
function GameRules() {
  const rules = [
    {
      icon: '🎯',
      title: 'Obiettivo',
      description: 'Colleziona 6 carte indovinando la posizione corretta delle situazioni sfortunate!'
    },
    {
      icon: '⏱️',
      title: 'Tempo Limite',
      description: 'Hai 30 secondi per ogni round per decidere dove posizionare la carta!'
    },
    {
      icon: '📊',
      title: 'Indice di Sfortuna',
      description: 'Ogni situazione ha un punteggio da 1 (leggero fastidio) a 100 (disastro totale)!'
    },
    {
      icon: '❌',
      title: 'Attenzione',
      description: 'Se fai 3 errori o il tempo scade, perdi la partita!'
    }
  ];

  return (
    <div className="mt-5 pt-5">
      <h2 className="text-center mb-4">Come si Gioca</h2>
      <Row className="g-4">
        {rules.map((rule, index) => (
          <Col md={6} key={index}>
            <Card className="h-100 p-3 border-0 shadow-sm">
              <div className="d-flex align-items-start">
                <div className="me-3">
                  <span style={{ fontSize: '1.5rem' }}>{rule.icon}</span>
                </div>
                <div>
                  <h5>{rule.title}</h5>
                  <p className="text-muted mb-0">{rule.description}</p>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default GameRules;