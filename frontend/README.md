# CodeAlchemy Frontend

A modern, professional frontend for the AI Code Converter & Bug Detector. Built with React, Vite, and Tailwind CSS.

## Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top navigation bar
│   │   ├── Footer.jsx          # Footer with links
│   │   ├── CodeForm.jsx        # Code input form
│   │   ├── CodeEditor.jsx      # Code display component
│   │   ├── BugReport.jsx       # Bug analysis display
│   │   ├── ConversionStats.jsx # Conversion statistics
│   │   ├── ResultsDisplay.jsx  # Results container
│   │   └── FeatureHighlights.jsx # Features showcase
│   ├── styles/
│   │   └── globals.css         # Global styles
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── README.md
```

## Features

- ✨ Modern dark theme with glassmorphism design
- 🎨 Responsive layout (mobile, tablet, desktop)
- ⚡ Fast and smooth animations
- 🎯 Tab-based navigation
- 📱 Mobile-friendly interface
- 🌙 Professional dark mode UI

## Technology Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility CSS framework
- **Lucide React** - Icon library

## Colors & Design

- Primary: Indigo (#6366f1)
- Secondary: Purple (#8b5cf6)
- Background: Dark slate (#0f172a)
- Text: Light slate (#e2e8f0)

## Customization

Edit `tailwind.config.js` to customize colors, fonts, and other design tokens.

## License

MIT
