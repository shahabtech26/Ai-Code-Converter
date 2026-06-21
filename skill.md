# CodeAlchemy Claude Skill

## Purpose
This document defines the CodeAlchemy Claude plugin skill for the `code-converter` project. It describes available plugin actions, the Claude manifest, and how to run the plugin locally.

## Capabilities
- Convert code between languages using the existing backend conversion pipeline
- Detect bugs and quality issues in code
- Expose backend health status for plugin debugging

## Plugin endpoints
- `POST /plugin/convert` — convert source code to a target language
- `POST /plugin/bugs` — analyze code for bugs, security, and style issues
- `GET /plugin/health` — check plugin service status
- `GET /.well-known/ai-plugin.json` — Claude plugin manifest
- `GET /openapi.yaml` — OpenAPI specification for plugin actions

## Backend integration
The plugin is implemented inside `backend/routes/plugin.js` and reuses the existing converter helpers from `backend/routes/convert.js`.

### Server configuration
The backend now serves the plugin manifest and OpenAPI spec from:
- `http://localhost:3001/.well-known/ai-plugin.json`
- `http://localhost:3001/openapi.yaml`

## Usage with Claude
1. Start the backend: `cd backend && npm run dev`
2. Open the Claude custom plugin registration workflow
3. Provide the manifest URL: `http://localhost:3001/.well-known/ai-plugin.json`
4. Use the plugin actions to convert code and check for bugs

## Notes
- The plugin currently uses no authentication for local development.
- Production deployments should add authentication and HTTPS before exposing the plugin publicly.
