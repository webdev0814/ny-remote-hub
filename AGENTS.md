# Agent Briefing: ny-remote-hub

## 1. Repository Overview & Purpose
- **Repository Name**: `ny-remote-hub`
- **Visibility**: `Public`
- **Default Branch**: `main`
- **Last Updated / Pushed**: 2026-06-16
- **Description**: Premium dashboard for tracking remote government contractor job opportunities.

- **Topics/Tags**: dashboard, frontend, react, remote-jobs

---

## 2. Tech Stack & Architecture
- **Primary Language / Ecosystem**: JavaScript, Python Ecosystem
- **Key Directories**: Single root directory structure.
- **Notable Top-Level Files**: `.gitignore`, `aggregate_jobs.js`, `index.html`, `jobs.csv`, `jobs.json`, `jobs_data.js`, `requirements.txt`, `style.css`, `verify_urls.js`

---

## 3. Setup & Execution Commands
### Environment Setup & Installation
```bash
python -m venv .venv; .venv\Scripts\activate (Windows) or source .venv/bin/activate (Linux/Mac)
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
- `[cf1c0d9]` (2026-06-16) Filter out dead links and remove expired curated government contract listings
- `[0fdbc2d]` (2026-06-16) Update aggregator to filter jobs to 48 hours or newer
- `[388a254]` (2026-06-12) Make the entire job card clickable to improve UX
- `[4dd2f15]` (2026-06-12) Add cache buster query parameter to jobs_data.js script tag in index.html
- `[54bdb04]` (2026-06-12) Fix global scope assignment for jobsData in aggregate_jobs.js and update index.html/style.css with scope badges
- `[af01b42]` (2026-06-12) Initial commit of NY Remote Hub dashboard

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
