# Agent Briefing: ny-remote-hub

## 1. Repository Overview & Purpose
- **Repository**: `webdev0814/ny-remote-hub`
- **Visibility**: `Public`
- **Default Branch**: `main`
- **Last Updated / Pushed**: 2026-09-09
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
- `[0097ac1]` (2026-09-09) docs: update agent briefing with multi-computer handoff protocol
- `[271695c]` (2026-09-09) docs: update agent briefing with multi-computer handoff protocol
- `[59c9577]` (2026-09-09) docs: update agent briefing with multi-computer handoff protocol
- `[d96e42e]` (2026-09-09) docs: update agent briefing with multi-computer handoff protocol
- `[11abf5a]` (2026-09-09) docs: update agent briefing with multi-computer handoff protocol
- `[baef890]` (2026-09-09) docs: update agent briefing with multi-computer handoff protocol
- `[3a0eaad]` (2026-09-09) docs: update agent briefing with multi-computer handoff protocol
- `[7b25b05]` (2026-09-09) docs: update agent briefing with multi-computer handoff protocol
- `[312f535]` (2026-09-09) docs: update agent briefing with multi-computer handoff protocol
- `[a1fcd27]` (2026-09-09) docs: update agent briefing with multi-computer handoff protocol

---

## 5. Current State & Immediate Next Steps
- **Current State**: Project is active under branch `main`.
- **When picking up this repo**:
  1. Inspect the top-level files and recent commits to understand the active feature or bugfix context.
  2. Verify all required credentials and environment variables before running integration scripts.
  3. Ensure all tests and linting pass after making modifications.
  4. Follow the repository conventions and preserve existing architecture patterns.

---

## 6. Multi-Computer Handoff & Git Sync Protocol
- **On Session Start**: Always run `git pull` when opening this repository on any computer to synchronize the latest changes.
- **On Task Completion**: Before ending any agent session, the agent **MUST**:
  1. Update Section 5 (Current State & Next Steps) in this `AGENTS.md` file.
  2. Stage all modifications (`git add .`).
  3. Commit with a concise conventional message (`git commit -m "feat/fix: ..."`).
  4. Push directly to GitHub (`git push`).
- **Secret Hygiene**: NEVER commit plain-text API keys, tokens, or credentials into repository files.
