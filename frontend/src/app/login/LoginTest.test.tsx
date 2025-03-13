import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
    }),
  }));

// Mock decodeToken
jest.mock('@/components/utils/decodeToken', () => ({
  decodeToken: jest.fn(() => ({
    username: 'testuser',
    userId: '123',
  })),
}));

// Mock window.alert
beforeAll(() => {
  window.alert = jest.fn();
});

describe('LoginPage', () => {
  beforeEach(() => {
    // Clear all mocks and localStorage before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders the login form', () => {
    render(<LoginPage />);

    // Check if the form elements are rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('allows entering email and password', () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

    // Simulate user typing
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Check if the input values are updated
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('toggles password visibility', () => {
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const toggleButton = screen.getByTestId('toggle-password-visibility');

    // Initially, the password should be hidden
    expect(passwordInput.type).toBe('password');

    // Click the toggle button
    fireEvent.click(toggleButton);

    // After clicking, the password should be visible
    expect(passwordInput.type).toBe('text');

    // Click the toggle button again
    fireEvent.click(toggleButton);

    // The password should be hidden again
    expect(passwordInput.type).toBe('password');
  });

  it('submits the form and navigates to the dashboard on successful login', async () => {
    // Mock a valid token response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-token' }),
      })
    ) as jest.Mock;

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simulate form submission
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Wait for the fetch call to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/api/login/enter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });
    });

    // Check if the token is stored in localStorage
    expect(localStorage.getItem('token')).toBe('fake-token');

    // Check if the router push function is called with the correct URL
    expect(useRouter().push).toHaveBeenCalledWith(
      '/dashboard?username=testuser&Id=123'
    );
  });

  it('shows an error message on login failure', async () => {
    // Mock a failed fetch response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      })
    ) as jest.Mock;

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Simulate form submission
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Wait for the error message to appear
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Login failed. Please check your credentials.');
    });
  });
});