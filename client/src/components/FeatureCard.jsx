import React from 'react';
import { Card } from 'react-bootstrap';

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="h-100 text-center p-4 border-0 shadow-sm">
      <div className="mb-3">
        <h1 style={{ color: '#8b5cf6', fontSize: '3rem' }}>{icon}</h1>
      </div>
      <h4>{title}</h4>
      <p className="text-muted">{description}</p>
    </Card>
  );
}

export default FeatureCard;