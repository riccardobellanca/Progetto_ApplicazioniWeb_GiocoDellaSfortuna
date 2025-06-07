import { Container, Row, Col } from 'react-bootstrap';
import NavBar from '../components/NavBar';
import IntroSection from '../components/IntroSection';
import FeatureCard from '../components/FeatureCard';
import GameRules from '../components/GameRules';

function HomePage() {
  const features = [
    {
      icon: '📚',
      title: 'Situazioni Universitarie',
      description: 'Oltre 50 situazioni esilaranti e drammatiche dalla vita universitaria!'
    },
    {
      icon: '👤',
      title: 'Sfida Te Stesso',
      description: 'Quanto bene conosci i livelli di sfortuna? Testa la tua intuizione!'
    },
    {
      icon: '🏆',
      title: 'Cronologia Partite',
      description: 'Tieni traccia delle tue partite e migliora le tue prestazioni!'
    }
  ];

  return (
    <>
      <NavBar />
      <IntroSection />
      
      {/* Features Section */}
      <Container className="py-5">
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col md={4} key={index}>
              <FeatureCard 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </Col>
          ))}
        </Row>

        <GameRules />

        {/* Strategia Section */}
        <div className="mt-5 text-center p-5" style={{ backgroundColor: '#f8f5ff', borderRadius: '10px' }}>
          <h3>💡 Strategia</h3>
          <p className="text-muted">
            Osserva bene le tue carte e il loro ordine. Dove si posiziona la nuova situazione?
            Prima di una carta meno sfortunata? Dopo una più drammatica? Tu decidi!
          </p>
        </div>
      </Container>
    </>
  );
}

export default HomePage;