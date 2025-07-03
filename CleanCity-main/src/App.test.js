import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppContent } from './App';
import '@testing-library/jest-dom';

describe('App', () => {
  test('renders navbar and landing page by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppContent />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /CleanCity/i })).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Schedule Pickup/i)).toBeInTheDocument();
    expect(screen.getByText(/Blog/i)).toBeInTheDocument();
    expect(screen.getByText(/Community/i)).toBeInTheDocument();
    expect(screen.getByText(/Awareness/i)).toBeInTheDocument();
    expect(screen.getByText(/Feedback/i)).toBeInTheDocument();
  });

  test('renders login page when navigating to /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppContent />
      </MemoryRouter>
    );
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('renders register page when navigating to /register', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <AppContent />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /Sign Up/i })).toBeInTheDocument();
  });

  test('renders login page elements', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppContent />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
  });
});
