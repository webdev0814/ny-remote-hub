# Agent Briefing: ny-remote-hub

## 1. Repository Overview & Purpose
- **Repository**: `webdev0814/ny-remote-hub`
- **Visibility**: `Public`
- **Default Branch**: `main`
- **Last Updated / Pushed**: 2026-09-08
- **Description**: Premium dashboard for tracking remote government contractor job opportunities.

- **Topics/Tags**: dashboard, frontend, react, remote-jobs

---

## 2. Tech Stack & Architecture
- **Primary Language / Ecosystem**: JavaScript, Python Ecosystem
- **Key Directories**: Single root directory structure.
- **Notable Top-Level Files**: `.gitignore`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `aggregate_jobs.js`, `index.html`, `jobs.csv`, `jobs.json`, `jobs_data.js`, `requirements.txt`, `style.css`, `verify_urls.js`

---

## 3. Setup & Execution Commands
### Environment Setup & Installation
```bash
python3 -m venv .venv && source .venv/bin/activate (Linux/Mac) or .venv\Scripts\activate (Windows)
pip install -r requirements.txt
```

### Running / Starting
```bash
# Check main entry point scripts or config files.
```

### Testing / Verification
```bash
# Run relevant unit/integration tests (e.g. pytest or npm test)
```

---

## 4. Recent Commit Activity (Where We Left Off)
The most recent commits show the latest development trajectory:
- `[4361366]` (2026-09-08) docs: update agent briefing (AGENTS.md, GEMINI.md, CLAUDE.md)
- `[1dba9d0]` (2026-09-08) docs: update agent briefing (AGENTS.md, GEMINI.md, CLAUDE.md)
- `[166af10]` (2026-09-08) docs: update agent briefing (AGENTS.md, GEMINI.md, CLAUDE.md)
- `[c605cf8]` (2026-09-08) docs: update agent briefing (AGENTS.md, GEMINI.md, CLAUDE.md)
- `[0d2dca8]` (2026-09-08) docs: update agent briefing (AGENTS.md, GEMINI.md, CLAUDE.md)
- `[7e0ca82]` (2026-09-08) docs: update agent briefing (AGENTS.md, GEMINI.md, CLAUDE.md)
- `[aafc08b]` (2026-09-08) docs: update agent briefing (AGENTS.md, GEMINI.md, CLAUDE.md)
- `[aa94b94]` (2026-09-08) docs: update agent briefing (AGENTS.md, GEMINI.md, CLAUDE.md)
- `[a2d3c41]` (2026-09-08) docs: update agent briefing (AGENTS.md, GEMINI.md, CLAUDE.md)
- `[f2545f9]` (2026-09-08) docs: update agent briefing (AGENTS.md, GEMINI.md, CLAUDE.md)

---

## 5. Current State & Immediate Next Steps
- **Current State**: Project is active under branch `main`.
- **When picking up this repo**:
  1. Inspect the top-level files and recent commits to understand the active feature or bugfix context.
  2. Verify all required credentials and environment variables before running integration scripts.
  3. Ensure all tests and linting pass after making modifications.
  4. Follow the repository conventions and preserve existing architecture patterns.

---

## 6. Agent Working Guidelines & Gotchas
- **Cross-Platform Compatibility**: Code may run across Windows, macOS, or Linux agent environments. Ensure path manipulations use OS-agnostic methods (e.g. `pathlib.Path` or `path.join`).
- **Secret Hygiene**: NEVER commit plain-text API keys, tokens, or credentials into repository files.
- **Git Commit Etiquette**: Use concise, conventional commit messages (e.g., `feat:`, `fix:`, `docs:`, `refactor:`).
- **Tooling Compatibility**: This briefing is kept aligned for Antigravity (`GEMINI.md`), Claude Code / Codex (`CLAUDE.md`), and general autonomous agents (`AGENTS.md`).
