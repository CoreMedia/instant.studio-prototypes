import React from 'react';
import { createRoot } from 'react-dom/client';
import ContentChooser from './components/ContentChooser';
import './style.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<ContentChooser />);
}

export { default as ContentChooser } from './components/ContentChooser';
