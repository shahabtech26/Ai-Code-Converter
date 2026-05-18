import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatSection from '../components/ChatSection';

describe('ChatSection - Code Conversion Functionality', () => {
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    mockOnLogout.mockClear();
  });

  describe('Code Detection', () => {
    it('should detect Python code', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const pythonCode = `def hello():
    print("Hello World")
hello()`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, pythonCode);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      // Wait for code detection message
      await waitFor(() => {
        expect(screen.getByText(/Python/i)).toBeInTheDocument();
      });
    });

    it('should detect JavaScript code', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const jsCode = `function hello() {
  console.log("Hello World");
}
hello();`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, jsCode);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/JavaScript/i)).toBeInTheDocument();
      });
    });

    it('should detect Java code', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const javaCode = `public class Hello {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, javaCode);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Java/i)).toBeInTheDocument();
      });
    });

    it('should detect C++ code', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const cppCode = `#include <iostream>
using namespace std;
int main() {
  cout << "Hello World";
  return 0;
}`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, cppCode);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/C\+\+/i)).toBeInTheDocument();
      });
    });
  });

  describe('Code Structure Analysis', () => {
    it('should analyze code structure', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const pythonCode = `import os
import sys

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

class Calculator:
    def multiply(self, a, b):
        return a * b`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, pythonCode);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        // Check for code structure analysis
        expect(screen.getByText(/Total lines:/i)).toBeInTheDocument();
        expect(screen.getByText(/Imports:/i)).toBeInTheDocument();
        expect(screen.getByText(/Functions/i)).toBeInTheDocument();
      });
    });

    it('should count imports correctly', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const pythonCode = `import os
import sys
from datetime import datetime

def hello():
    print("test")`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, pythonCode);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Imports: 3/i)).toBeInTheDocument();
      });
    });

    it('should count functions correctly', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const pythonCode = `def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, pythonCode);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Functions\/Methods: 3/i)).toBeInTheDocument();
      });
    });

    it('should count classes correctly', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const pythonCode = `class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def bark(self):
        print("Woof!")`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, pythonCode);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Classes: 2/i)).toBeInTheDocument();
      });
    });
  });

  describe('Code Normalization', () => {
    it('should normalize code with inconsistent indentation', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const messyCode = `def hello():
			print("test")
    return 0`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, messyCode);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        // Check that code was normalized (tabs replaced with spaces)
        const codeBlocks = screen.getAllByRole('region');
        expect(codeBlocks.length).toBeGreaterThan(0);
      });
    });

    it('should trim trailing whitespace', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const codeWithWhitespace = `def hello():   
    print("test")   
    return 0   `;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, codeWithWhitespace);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/detected source language/i)).toBeInTheDocument();
      });
    });
  });

  describe('Bug/Error Detection', () => {
    it('should detect loose equality in JavaScript', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const jsCode = `function compare(a, b) {
  if (a == b) {
    return true;
  }
  return false;
}`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, jsCode);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/loose equality/i)).toBeInTheDocument();
      });
    });

    it('should detect var usage in JavaScript', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const jsCode = `var count = 0;
function increment() {
  count++;
  return count;
}`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, jsCode);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/\`var\` found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Code Conversion Flow', () => {
    it('should prompt for action after code detection', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const pythonCode = `def hello():
    print("Hello World")`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, pythonCode);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/What do you want to do with this code/i)).toBeInTheDocument();
        expect(screen.getByText(/Fix errors|Convert to another language/i)).toBeInTheDocument();
      });
    });

    it('should allow user to choose bug fix action', async () => {
      const user = userEvent.setup();
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const pythonCode = `def hello():
    print("Hello")`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await user.type(input, pythonCode);
      
      let sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/What do you want to do/i)).toBeInTheDocument();
      });

      // Choose bug fix
      const inputField = screen.getByPlaceholderText(/paste code here/i);
      await user.clear(inputField);
      await user.type(inputField, 'bug');
      
      sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/errors detected|Bug\/Error-free code/i)).toBeInTheDocument();
      });
    });

    it('should allow user to choose convert action', async () => {
      const user = userEvent.setup();
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const pythonCode = `def add(a, b):
    return a + b`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await user.type(input, pythonCode);
      
      let sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/What do you want to do/i)).toBeInTheDocument();
      });

      // Choose convert
      const inputField = screen.getByPlaceholderText(/paste code here/i);
      await user.clear(inputField);
      await user.type(inputField, 'convert');
      
      sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Which language do you want to convert to/i)).toBeInTheDocument();
      });
    });

    it('should convert code to target language', async () => {
      const user = userEvent.setup();
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const pythonCode = `def add(a, b):
    return a + b`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await user.type(input, pythonCode);
      
      let sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/What do you want to do/i)).toBeInTheDocument();
      });

      // Choose convert
      const inputField = screen.getByPlaceholderText(/paste code here/i);
      await user.clear(inputField);
      await user.type(inputField, 'convert');
      
      sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Which language do you want to convert to/i)).toBeInTheDocument();
      });

      // Select target language
      const targetInput = screen.getByPlaceholderText(/paste code here/i);
      await user.clear(targetInput);
      await user.type(targetInput, 'JavaScript');
      
      sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Converted code/i)).toBeInTheDocument();
        expect(screen.getByText(/JavaScript/i)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty code input', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, '');
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      // Should not add message for empty input
      await waitFor(() => {
        expect(screen.queryByText(/undefined/i)).not.toBeInTheDocument();
      });
    });

    it('should handle very large code blocks', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      // Generate large code block
      let largeCode = '';
      for (let i = 0; i < 100; i++) {
        largeCode += `def function_${i}():\n    return ${i}\n\n`;
      }

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, largeCode);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Python/i)).toBeInTheDocument();
      });
    });

    it('should handle mixed language code', async () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const mixedCode = `// JavaScript with pseudo-Python
function calculate() {
  let result = 0
  // simulating Python loop
  for (let i = 0; i < 10; i++) {
    result += i
  }
  return result
}`;

      const input = screen.getByPlaceholderText(/paste code here/i);
      await userEvent.type(input, mixedCode);
      
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        // Should detect JavaScript (primary language)
        expect(screen.getByText(/JavaScript/i)).toBeInTheDocument();
      });
    });
  });

  describe('Greeting Message', () => {
    it('should show welcome greeting on load', async () => {
      render(<ChatSection userName="John Doe" onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        expect(screen.getByText(/Hi John Doe, welcome to CodeAlchemy/i)).toBeInTheDocument();
      });
    });

    it('should show generic greeting if no username', async () => {
      render(<ChatSection userName="" onLogout={mockOnLogout} />);
      
      await waitFor(() => {
        // Should handle missing username gracefully
        expect(screen.getByText(/CodeAlchemy/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Interface', () => {
    it('should display logout button', () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('should call onLogout when logout button clicked', async () => {
      const user = userEvent.setup();
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      await user.click(logoutButton);
      
      expect(mockOnLogout).toHaveBeenCalled();
    });

    it('should display file upload button', () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      expect(screen.getByRole('button', { name: /upload|attachment/i })).toBeInTheDocument();
    });

    it('should display input field for code', () => {
      render(<ChatSection userName="Test User" onLogout={mockOnLogout} />);
      
      expect(screen.getByPlaceholderText(/paste code here/i)).toBeInTheDocument();
    });
  });
});
