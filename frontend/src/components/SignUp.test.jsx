import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from '../components/SignUp';

describe('SignUp Component', () => {
  const mockOnBack = vi.fn();
  const mockOnSignInClick = vi.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
    mockOnSignInClick.mockClear();
  });

  describe('Rendering', () => {
    it('should render the SignUp form', () => {
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('should render all input fields', () => {
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2);
    });

    it('should render country dropdown', () => {
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const countrySelect = screen.getByRole('combobox');
      expect(countrySelect).toBeInTheDocument();
      expect(screen.getByText('Select Country')).toBeInTheDocument();
    });

    it('should render all country options', () => {
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('United Kingdom')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Australia')).toBeInTheDocument();
      expect(screen.getByText('India')).toBeInTheDocument();
    });

    it('should render terms and conditions checkbox', () => {
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText(/I agree to the Terms and Conditions/i)).toBeInTheDocument();
    });

    it('should render Create Account button', () => {
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('should render Sign In link', () => {
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });
  });

  describe('User Input', () => {
    it('should update name input value', async () => {
      const user = userEvent.setup();
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const nameInput = screen.getByPlaceholderText('John Doe');
      await user.type(nameInput, 'Jane Doe');
      
      expect(nameInput.value).toBe('Jane Doe');
    });

    it('should update email input value', async () => {
      const user = userEvent.setup();
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      await user.type(emailInput, 'jane@example.com');
      
      expect(emailInput.value).toBe('jane@example.com');
    });

    it('should update country select value', async () => {
      const user = userEvent.setup();
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const countrySelect = screen.getByRole('combobox');
      await user.selectOptions(countrySelect, 'Canada');
      
      expect(countrySelect.value).toBe('Canada');
    });

    it('should update password input value', async () => {
      const user = userEvent.setup();
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      await user.type(passwordInputs[0], 'Password123!');
      
      expect(passwordInputs[0].value).toBe('Password123!');
    });

    it('should update confirm password input value', async () => {
      const user = userEvent.setup();
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      await user.type(passwordInputs[1], 'Password123!');
      
      expect(passwordInputs[1].value).toBe('Password123!');
    });

    it('should toggle agree checkbox', async () => {
      const user = userEvent.setup();
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox.checked).toBe(false);
      
      await user.click(checkbox);
      expect(checkbox.checked).toBe(true);
      
      await user.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });
  });

  describe('Form Validation', () => {
    it('should validate that all fields are required', () => {
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const nameInput = screen.getByPlaceholderText('John Doe');
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const countrySelect = screen.getByRole('combobox');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      
      expect(nameInput.hasAttribute('required')).toBe(true);
      expect(emailInput.hasAttribute('required')).toBe(true);
      expect(countrySelect.hasAttribute('required')).toBe(true);
      expect(passwordInputs[0].hasAttribute('required')).toBe(true);
      expect(passwordInputs[1].hasAttribute('required')).toBe(true);
    });

    it('should show alert when passwords do not match', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const nameInput = screen.getByPlaceholderText('John Doe');
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const countrySelect = screen.getByRole('combobox');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      
      await user.type(nameInput, 'Jane Doe');
      await user.type(emailInput, 'jane@example.com');
      await user.selectOptions(countrySelect, 'Canada');
      await user.type(passwordInputs[0], 'Password123!');
      await user.type(passwordInputs[1], 'DifferentPassword123!');
      
      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);
      
      expect(alertSpy).toHaveBeenCalledWith('Passwords do not match!');
      alertSpy.mockRestore();
    });

    it('should show alert when terms are not agreed', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const nameInput = screen.getByPlaceholderText('John Doe');
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const countrySelect = screen.getByRole('combobox');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      
      await user.type(nameInput, 'Jane Doe');
      await user.type(emailInput, 'jane@example.com');
      await user.selectOptions(countrySelect, 'Canada');
      await user.type(passwordInputs[0], 'Password123!');
      await user.type(passwordInputs[1], 'Password123!');
      
      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Please agree to Terms and Conditions');
      });
      alertSpy.mockRestore();
    });
  });

  describe('Form Submission', () => {
    it('should successfully submit form with all valid fields', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const nameInput = screen.getByPlaceholderText('John Doe');
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const countrySelect = screen.getByRole('combobox');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      const checkbox = screen.getByRole('checkbox');
      
      await user.type(nameInput, 'Jane Doe');
      await user.type(emailInput, 'jane@example.com');
      await user.selectOptions(countrySelect, 'Canada');
      await user.type(passwordInputs[0], 'Password123!');
      await user.type(passwordInputs[1], 'Password123!');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);
      
      expect(alertSpy).toHaveBeenCalledWith('Account created for: jane@example.com');
      alertSpy.mockRestore();
    });

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      vi.spyOn(window, 'alert').mockImplementation();
      
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const nameInput = screen.getByPlaceholderText('John Doe');
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const countrySelect = screen.getByRole('combobox');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      const checkbox = screen.getByRole('checkbox');
      
      await user.type(nameInput, 'Jane Doe');
      await user.type(emailInput, 'jane@example.com');
      await user.selectOptions(countrySelect, 'Canada');
      await user.type(passwordInputs[0], 'Password123!');
      await user.type(passwordInputs[1], 'Password123!');
      await user.click(checkbox);
      
      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(countrySelect.value).toBe('');
        expect(passwordInputs[0].value).toBe('');
        expect(passwordInputs[1].value).toBe('');
        expect(checkbox.checked).toBe(false);
      });
    });
  });

  describe('Navigation', () => {
    it('should call onBack when back button is clicked', async () => {
      const user = userEvent.setup();
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);
      
      expect(mockOnBack).toHaveBeenCalled();
    });

    it('should call onSignInClick when Sign In link is clicked', async () => {
      const user = userEvent.setup();
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const signInButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(signInButton);
      
      expect(mockOnSignInClick).toHaveBeenCalled();
    });
  });

  describe('Form Attributes', () => {
    it('should have required attributes on input fields', () => {
      render(<SignUp onBack={mockOnBack} onSignInClick={mockOnSignInClick} />);
      
      const nameInput = screen.getByPlaceholderText('John Doe');
      const emailInput = screen.getByPlaceholderText('your@email.com');
      const countrySelect = screen.getByRole('combobox');
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      
      expect(nameInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(countrySelect).toHaveAttribute('required');
      expect(passwordInputs[0]).toHaveAttribute('required');
      expect(passwordInputs[0]).toHaveAttribute('type', 'password');
      expect(passwordInputs[1]).toHaveAttribute('required');
      expect(passwordInputs[1]).toHaveAttribute('type', 'password');
    });
  });
});
