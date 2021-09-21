import { render, screen } from '@testing-library/react';
import App from './App';

test('renders foo', () => {
  render(<App />);
  const linkElement = screen.getByDisplayValue(/foo/i);
  expect(linkElement).toBeInTheDocument();
});
