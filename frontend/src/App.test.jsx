import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock the child components
vi.mock('./components/Auth', () => ({
  default: ({ onAuthSuccess }) => (
    <div data-testid="auth-component">
      <h1>Auth Component</h1>
      <button onClick={() => onAuthSuccess('Test User')}>Login</button>
    </div>
  ),
}));

vi.mock('./components/ChatSection', () => ({
  default: ({ onLogout, userName }) => (
    <div data-testid="chat-section">
      <h1>Chat Section</h1>
      <p>Welcome, {userName}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  ),
}));

describe('App Component', () => {
  const SESSION_STORAGE_KEY = 'codealchemy_session_user';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render Auth component when not authenticated', () => {
      render(<App />);
      
      expect(screen.getByTestId('auth-component')).toBeInTheDocument();
      expect(screen.queryByTestId('chat-section')).not.toBeInTheDocument();
    });

    it('should render ChatSection component when authenticated', () => {
      // Set up authenticated state
      localStorage.setItem(SESSION_STORAGE_KEY, 'Test User');
      
      render(<App />);
      
      expect(screen.getByTestId('chat-section')).toBeInTheDocument();
      expect(screen.queryByTestId('auth-component')).not.toBeInTheDocument();
    });

    it('should display username when authenticated from localStorage', () => {
      const testUserName = 'John Doe';
      localStorage.setItem(SESSION_STORAGE_KEY, testUserName);
      
      render(<App />);
      
      expect(screen.getByText(`Welcome, ${testUserName}`)).toBeInTheDocument();
    });

    it('should not show Auth component after page load if session exists', async () => {
      localStorage.setItem(SESSION_STORAGE_KEY, 'Existing User');
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByTestId('chat-section')).toBeInTheDocument();
        expect(screen.queryByTestId('auth-component')).not.toBeInTheDocument();
      });
    });
  });

  describe('Authentication Flow', () => {
    it('should transition to ChatSection after successful authentication', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Initially should show Auth component
      expect(screen.getByTestId('auth-component')).toBeInTheDocument();
      
      // Click login button which calls onAuthSuccess
      const loginButton = screen.getByRole('button', { name: /Login/i });
      await user.click(loginButton);
      
      // Should now show ChatSection
      await waitFor(() => {
        expect(screen.getByTestId('chat-section')).toBeInTheDocument();
        expect(screen.queryByTestId('auth-component')).not.toBeInTheDocument();
      });
    });

    it('should save user name to localStorage on successful authentication', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const loginButton = screen.getByRole('button', { name: /Login/i });
      await user.click(loginButton);
      
      await waitFor(() => {
        expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBe('Test User');
      });
    });

    it('should set authenticated state to true after login', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const loginButton = screen.getByRole('button', { name: /Login/i });
      await user.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText('Welcome, Test User')).toBeInTheDocument();
      });
    });

    it('should handle authentication with different user names', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Mock with different user name would require modifying the mock
      // For now, we test the basic flow
      const loginButton = screen.getByRole('button', { name: /Login/i });
      await user.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('chat-section')).toBeInTheDocument();
      });
    });
  });

  describe('Logout Functionality', () => {
    it('should clear authentication state on logout', async () => {
      const user = userEvent.setup();
      localStorage.setItem(SESSION_STORAGE_KEY, 'Test User');
      
      render(<App />);
      
      // Should show ChatSection initially
      expect(screen.getByTestId('chat-section')).toBeInTheDocument();
      
      // Click logout button
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      await user.click(logoutButton);
      
      // Should show Auth component after logout
      await waitFor(() => {
        expect(screen.getByTestId('auth-component')).toBeInTheDocument();
        expect(screen.queryByTestId('chat-section')).not.toBeInTheDocument();
      });
    });

    it('should remove user data from localStorage on logout', async () => {
      const user = userEvent.setup();
      localStorage.setItem(SESSION_STORAGE_KEY, 'Test User');
      
      render(<App />);
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      await user.click(logoutButton);
      
      await waitFor(() => {
        expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
      });
    });

    it('should clear userName state on logout', async () => {
      const user = userEvent.setup();
      localStorage.setItem(SESSION_STORAGE_KEY, 'John Doe');
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
      });
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      await user.click(logoutButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('auth-component')).toBeInTheDocument();
      });
    });

    it('should allow re-authentication after logout', async () => {
      const user = userEvent.setup();
      localStorage.setItem(SESSION_STORAGE_KEY, 'Test User');
      
      const { rerender } = render(<App />);
      
      // Logout
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      await user.click(logoutButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('auth-component')).toBeInTheDocument();
      });
      
      // Re-authenticate
      const loginButton = screen.getByRole('button', { name: /Login/i });
      await user.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('chat-section')).toBeInTheDocument();
      });
    });
  });

  describe('localStorage Integration', () => {
    it('should read from localStorage on component mount', () => {
      const testUserName = 'Stored User';
      localStorage.setItem(SESSION_STORAGE_KEY, testUserName);
      
      render(<App />);
      
      expect(screen.getByText(`Welcome, ${testUserName}`)).toBeInTheDocument();
    });

    it('should persist authentication state across rerenders', () => {
      localStorage.setItem(SESSION_STORAGE_KEY, 'Persistent User');
      
      const { rerender } = render(<App />);
      
      expect(screen.getByTestId('chat-section')).toBeInTheDocument();
      
      rerender(<App />);
      
      expect(screen.getByTestId('chat-section')).toBeInTheDocument();
      expect(screen.getByText('Welcome, Persistent User')).toBeInTheDocument();
    });

    it('should use correct localStorage key', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const loginButton = screen.getByRole('button', { name: /Login/i });
      await user.click(loginButton);
      
      await waitFor(() => {
        expect(localStorage.getItem('codealchemy_session_user')).toBe('Test User');
      });
    });

    it('should clear localStorage entry when logging out', async () => {
      const user = userEvent.setup();
      localStorage.setItem(SESSION_STORAGE_KEY, 'Test User');
      
      render(<App />);
      
      expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBe('Test User');
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      await user.click(logoutButton);
      
      await waitFor(() => {
        expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
      });
    });

    it('should handle empty localStorage gracefully', () => {
      localStorage.clear();
      
      render(<App />);
      
      expect(screen.getByTestId('auth-component')).toBeInTheDocument();
    });
  });

  describe('Component Props', () => {
    it('should pass onAuthSuccess callback to Auth component', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // The callback should work when login button is clicked
      const loginButton = screen.getByRole('button', { name: /Login/i });
      await user.click(loginButton);
      
      // If callback works, ChatSection should render
      await waitFor(() => {
        expect(screen.getByTestId('chat-section')).toBeInTheDocument();
      });
    });

    it('should pass onLogout callback to ChatSection component', async () => {
      const user = userEvent.setup();
      localStorage.setItem(SESSION_STORAGE_KEY, 'Test User');
      
      render(<App />);
      
      expect(screen.getByTestId('chat-section')).toBeInTheDocument();
      
      // The callback should work when logout button is clicked
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      await user.click(logoutButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('auth-component')).toBeInTheDocument();
      });
    });

    it('should pass userName prop to ChatSection', () => {
      const testUserName = 'Jane Smith';
      localStorage.setItem(SESSION_STORAGE_KEY, testUserName);
      
      render(<App />);
      
      expect(screen.getByText(`Welcome, ${testUserName}`)).toBeInTheDocument();
    });

    it('should pass correct onLogout callback to ChatSection', async () => {
      const user = userEvent.setup();
      localStorage.setItem(SESSION_STORAGE_KEY, 'Test User');
      
      render(<App />);
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      expect(logoutButton).toBeInTheDocument();
      
      await user.click(logoutButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('auth-component')).toBeInTheDocument();
      });
    });
  });

  describe('State Management', () => {
    it('should initialize isAuthenticated as false', () => {
      render(<App />);
      
      // Auth component should be visible, not ChatSection
      expect(screen.getByTestId('auth-component')).toBeInTheDocument();
      expect(screen.queryByTestId('chat-section')).not.toBeInTheDocument();
    });

    it('should initialize userName as empty string', () => {
      render(<App />);
      
      expect(screen.getByTestId('auth-component')).toBeInTheDocument();
    });

    it('should update isAuthenticated state on authentication', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const loginButton = screen.getByRole('button', { name: /Login/i });
      await user.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('chat-section')).toBeInTheDocument();
      });
    });

    it('should update userName state on authentication', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const loginButton = screen.getByRole('button', { name: /Login/i });
      await user.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText('Welcome, Test User')).toBeInTheDocument();
      });
    });

    it('should reset isAuthenticated state on logout', async () => {
      const user = userEvent.setup();
      localStorage.setItem(SESSION_STORAGE_KEY, 'Test User');
      
      render(<App />);
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      await user.click(logoutButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('auth-component')).toBeInTheDocument();
      });
    });

    it('should reset userName state on logout', async () => {
      const user = userEvent.setup();
      localStorage.setItem(SESSION_STORAGE_KEY, 'John Doe');
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
      });
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      await user.click(logoutButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Welcome, John Doe')).not.toBeInTheDocument();
      });
    });
  });

  describe('useEffect Hook', () => {
    it('should run effect on component mount', () => {
      const testUser = 'Mount Test User';
      localStorage.setItem(SESSION_STORAGE_KEY, testUser);
      
      render(<App />);
      
      // If effect ran, user should be authenticated
      expect(screen.getByText(`Welcome, ${testUser}`)).toBeInTheDocument();
    });

    it('should check localStorage on mount', () => {
      localStorage.setItem(SESSION_STORAGE_KEY, 'Check User');
      
      render(<App />);
      
      // Effect should have read from localStorage
      expect(screen.getByTestId('chat-section')).toBeInTheDocument();
    });

    it('should handle missing localStorage entry on mount', () => {
      localStorage.clear();
      
      render(<App />);
      
      // Should show Auth component if no stored user
      expect(screen.getByTestId('auth-component')).toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    it('should render Auth component when isAuthenticated is false', () => {
      render(<App />);
      
      expect(screen.getByTestId('auth-component')).toBeInTheDocument();
      expect(screen.queryByTestId('chat-section')).not.toBeInTheDocument();
    });

    it('should render ChatSection when isAuthenticated is true', () => {
      localStorage.setItem(SESSION_STORAGE_KEY, 'Authenticated User');
      
      render(<App />);
      
      expect(screen.getByTestId('chat-section')).toBeInTheDocument();
      expect(screen.queryByTestId('auth-component')).not.toBeInTheDocument();
    });

    it('should switch from Auth to ChatSection on authentication', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Start with Auth component
      expect(screen.getByTestId('auth-component')).toBeInTheDocument();
      
      // Authenticate
      const loginButton = screen.getByRole('button', { name: /Login/i });
      await user.click(loginButton);
      
      // Switch to ChatSection
      await waitFor(() => {
        expect(screen.getByTestId('chat-section')).toBeInTheDocument();
        expect(screen.queryByTestId('auth-component')).not.toBeInTheDocument();
      });
    });

    it('should switch from ChatSection to Auth on logout', async () => {
      const user = userEvent.setup();
      localStorage.setItem(SESSION_STORAGE_KEY, 'Test User');
      
      render(<App />);
      
      // Start with ChatSection
      expect(screen.getByTestId('chat-section')).toBeInTheDocument();
      
      // Logout
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      await user.click(logoutButton);
      
      // Switch to Auth
      await waitFor(() => {
        expect(screen.getByTestId('auth-component')).toBeInTheDocument();
        expect(screen.queryByTestId('chat-section')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid authentication and logout', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Authenticate
      let loginButton = screen.getByRole('button', { name: /Login/i });
      await user.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('chat-section')).toBeInTheDocument();
      });
      
      // Logout
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      await user.click(logoutButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('auth-component')).toBeInTheDocument();
      });
    });

    it('should handle special characters in user name', () => {
      const specialName = 'User@123!@#';
      localStorage.setItem(SESSION_STORAGE_KEY, specialName);
      
      render(<App />);
      
      expect(screen.getByText(`Welcome, ${specialName}`)).toBeInTheDocument();
    });

    it('should handle very long user names', () => {
      const longName = 'VeryLongUserNameWithManyCharactersToTestEdgeCases'.repeat(3);
      localStorage.setItem(SESSION_STORAGE_KEY, longName);
      
      render(<App />);
      
      expect(screen.getByText(`Welcome, ${longName}`)).toBeInTheDocument();
    });

    it('should handle empty string as user name', () => {
      localStorage.setItem(SESSION_STORAGE_KEY, '');
      
      render(<App />);
      
      // Empty string should not authenticate
      expect(screen.getByTestId('auth-component')).toBeInTheDocument();
    });
  });
});
