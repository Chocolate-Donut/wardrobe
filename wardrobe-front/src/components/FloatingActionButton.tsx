// FloatingActionButton.tsx
import React from 'react';

const FloatingActionButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} style={fabStyle}>
    +
  </button>
);

const fabStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '30px',
  right: '30px',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#8860D0',
  color: 'white',
  fontSize: '30px',
  border: 'none',
  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  cursor: 'pointer',
  zIndex: 999,
};

export default FloatingActionButton;
