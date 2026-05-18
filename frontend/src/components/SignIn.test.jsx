import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignIn from '../components/SignIn';

describe('SignIn Component', () => {
  const mockOnBack = vi.fn();
  const mockOnSignUpClick = vi.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
    mockOnSignUpClick.mockClear();
  });

  describe('Rendering', () => {
    it('should render the SignIn form', () => {
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.textContent).toBe('Sign In');
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('should render all input fields', () => {
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('should render Sign In button', () => {
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('should render Sign Up link', () => {
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    });

    it('should render email and password labels', () => {
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
    });
  });

  describe('User Input', () => {
    it('should update email input value', async () => {
      const user = userEvent.setup();
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      await user.type(emailInput, 'jane@example.com');
      
      expect(emailInput.value).toBe('jane@example.com');
    });

    it('should update password input value', async () => {
      const user = userEvent.setup();
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const passwordInput = screen.getByPlaceholderText('••••••••');
      await user.type(passwordInput, 'Password123!');
      
      expect(passwordInput.value).toBe('Password123!');
    });

    it('should update both email and password fields independently', async () => {
      const user = userEvent.setup();
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'TestPass123!');
      
      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('TestPass123!');
    });

    it('should allow clearing input fields', async () => {
      const user = userEvent.setup();
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      await user.type(emailInput, 'test@example.com');
      await user.clear(emailInput);
      
      expect(emailInput.value).toBe('');
    });
  });

  describe('Form Validation', () => {
    it('should have required attributes on input fields', () => {
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should validate email input type', () => {
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      expect(emailInput.type).toBe('email');
    });

    it('should validate password input type', () => {
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const passwordInput = screen.getByPlaceholderText('••••••••');
      expect(passwordInput.type).toBe('password');
    });
  });

  describe('Form Submission', () => {
    it('should successfully submit form with valid credentials', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'jane@example.com');
      await user.type(passwordInput, 'Password123!');
      
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);
      
      expect(alertSpy).toHaveBeenCalledWith('Signed in as: jane@example.com');
      alertSpy.mockRestore();
    });

    it('should not submit form when email is empty', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const passwordInput = screen.getByPlaceholderText('••••••••');
      await user.type(passwordInput, 'Password123!');
      
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);
      
      expect(alertSpy).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('should not submit form when password is empty', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      await user.type(emailInput, 'jane@example.com');
      
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);
      
      expect(alertSpy).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('should not submit form when both fields are empty', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);
      
      expect(alertSpy).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('should reset form fields after successful submission', async () => {
      const user = userEvent.setup();
      vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'jane@example.com');
      await user.type(passwordInput, 'Password123!');
      
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(emailInput.value).toBe('');
        expect(passwordInput.value).toBe('');
      });
    });

    it('should handle form submission with Enter key', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'jane@example.com');
      await user.type(passwordInput, 'Password123!{Enter}');
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Signed in as: jane@example.com');
      });
      alertSpy.mockRestore();
    });

    it('should handle special characters in email and password', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'user+test@example.co.uk');
      await user.type(passwordInput, 'P@$$w0rd!#123');
      
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);
      
      expect(alertSpy).toHaveBeenCalledWith('Signed in as: user+test@example.co.uk');
      alertSpy.mockRestore();
    });
  });

  describe('Navigation', () => {
    it('should call onBack when back button is clicked', async () => {
      const user = userEvent.setup();
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);
      
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('should call onSignUpClick when Sign Up link is clicked', async () => {
      const user = userEvent.setup();
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
      await user.click(signUpButton);
      
      expect(mockOnSignUpClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onBack when form is submitted', async () => {
      const user = userEvent.setup();
      
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'jane@example.com');
      await user.type(passwordInput, 'Password123!');
      
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);
      
      expect(mockOnBack).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace in email field', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'jane@example.com');
      await user.type(passwordInput, 'Password123!');
      
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);
      
      expect(alertSpy).toHaveBeenCalledWith('Signed in as: jane@example.com');
      alertSpy.mockRestore();
    });

    it('should handle long email addresses', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const longEmail = 'very.long.email.address.with.many.characters@subdomain.example.com';
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, longEmail);
      await user.type(passwordInput, 'Password123!');
      
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);
      
      expect(alertSpy).toHaveBeenCalledWith(`Signed in as: ${longEmail}`);
      alertSpy.mockRestore();
    });

    it('should handle long passwords', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const longPassword = 'VeryLongPassword123456789WithSpecialChars';
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'jane@example.com');
      await user.type(passwordInput, longPassword);
      
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);
      
      expect(alertSpy).toHaveBeenCalledWith('Signed in as: jane@example.com');
      alertSpy.mockRestore();
    });

    it('should prevent default form submission behavior', async () => {
      const user = userEvent.setup();
      vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'jane@example.com');
      await user.type(passwordInput, 'Password123!');
      
      const form = screen.getByRole('button', { name: /Sign In/i }).closest('form');
      const preventDefaultSpy = vi.spyOn(Event.prototype, 'preventDefault');
      
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);
      
      expect(form).toBeInTheDocument();
    });
  });

  describe('Input Attributes', () => {
    it('should have correct placeholder attributes', () => {
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      expect(emailInput).toHaveAttribute('placeholder', 'your@email.com');
      expect(passwordInput).toHaveAttribute('placeholder', '••••••••');
    });

    it('should have autocomplete attributes', () => {
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      const form = screen.getByRole('button', { name: /Sign In/i }).closest('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have associated labels for inputs', () => {
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
    });

    it('should render buttons with accessible names', () => {
      render(<SignIn onBack={mockOnBack} onSignUpClick={mockOnSignUpClick} />);
      
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    });
  });
});
