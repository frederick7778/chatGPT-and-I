# Contributing to ToolKit AI

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 🎯 Code of Conduct

Be respectful and constructive in all interactions. We're building a community to solve real problems.

## 🐛 Reporting Issues

### Before Creating an Issue

- Check [existing issues](https://github.com/frederick7778/chatGPT-and-I/issues) to avoid duplicates
- Search closed issues—your problem might already be solved
- Gather as much information as possible

### How to Report

1. Use a clear, descriptive title
2. Describe the exact steps to reproduce
3. Provide expected vs. actual behavior
4. Include environment details:
   - OS and Node.js version
   - Package manager (pnpm version)
   - PostgreSQL version (if DB-related)
5. Attach screenshots or error logs if relevant

**Example:**
```
Title: Login page shows blank white screen on Safari

Steps:
1. Open https://toolkit-ai.example.com on Safari 16
2. Click "Login"
3. Page appears blank

Expected: Login form should render
Actual: White screen, no console errors visible

Environment: macOS 13, Safari 16, Node 24.0.0
```

## ✨ Suggesting Features

1. Use title: `[Feature] Brief description`
2. Explain the use case and why it's valuable
3. Provide mockups or examples if helpful
4. Discuss potential implementation approaches

## 🔧 Setting Up Development

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/chatGPT-and-I.git
cd chatGPT-and-I
git remote add upstream https://github.com/frederick7778/chatGPT-and-I.git
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Database

```bash
# Create a local PostgreSQL database
createdb toolkit_ai_dev

# Set up environment
cp .env.example .env.local  # (if available, or create manually)
echo 'DATABASE_URL=postgresql://localhost/toolkit_ai_dev' >> .env.local
echo 'SESSION_SECRET=dev-secret-min-32-chars-long-ok' >> .env.local
```

### 4. Run the App

```bash
# Terminal 1: API server
pnpm --filter @workspace/api-server run dev

# Terminal 2: Frontend
pnpm --filter @workspace/ai-productivity run dev
```

## 📝 Making Changes

### Branch Naming

```
feature/add-password-reset
fix/login-session-leak
docs/update-readme
chore/upgrade-typescript
```

### Commit Messages

- Use imperative mood: "Add feature" not "Added feature"
- Keep first line under 50 characters
- Add body for context if needed

```
Add password reset via email

Users can now reset forgotten passwords via secure email tokens.
Tokens expire after 1 hour and are one-time-use only.
```

### Code Style

- **TypeScript:** Strict mode enabled, no `any` types
- **Formatting:** Run `pnpm prettier --write .` before committing
- **Linting:** Ensure no TypeScript errors: `pnpm run typecheck`
- **Naming:** camelCase for variables/functions, PascalCase for components/classes

### Testing Your Changes

```bash
# Typecheck all packages
pnpm run typecheck

# Build all packages
pnpm run build

# After OpenAPI spec changes, regenerate:
pnpm --filter @workspace/api-spec run codegen
```

## 🔄 Submitting a Pull Request

### Before Opening

1. Update your fork: `git fetch upstream && git rebase upstream/replit-agent`
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Run `pnpm run typecheck && pnpm run build`
5. Commit with clear messages

### PR Template

```markdown
## Description
Brief explanation of what this PR does.

## Type of Change
- [ ] Bug fix (fixes #issue-number)
- [ ] New feature (relates to #issue-number)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactor

## Changes
- Bullet list of specific changes
- Keep it concise

## Testing
How did you test this? List steps or test cases.

## Screenshots/Demo
(If UI changes, include before/after screenshots)

## Checklist
- [ ] I've tested this locally
- [ ] Code follows project style guidelines
- [ ] TypeScript has no errors (`pnpm run typecheck`)
- [ ] No console warnings or errors
- [ ] PR title is clear and descriptive
- [ ] Commits have clear messages
```

### What to Expect

1. **Initial Review** — maintainer checks scope and approach
2. **Code Review** — feedback on implementation, style, tests
3. **Revisions** — address feedback and push updates
4. **Merge** — once approved, your changes go live

### Common Feedback

- **"Add validation"** — Use Zod schemas for API inputs
- **"Missing TypeScript types"** — No `any` types; be explicit
- **"Needs migration"** — Add Drizzle migration if schema changes
- **"Update OpenAPI spec"** — Sync `openapi.yaml` and regenerate

## 📚 Project-Specific Guidelines

### API Changes

When adding/modifying API endpoints:

1. Update `lib/api-spec/openapi.yaml` (source of truth)
2. Run `pnpm --filter @workspace/api-spec run codegen`
3. This auto-generates:
   - `lib/api-zod/` — Zod schemas
   - `lib/api-client-react/` — React hooks
4. Use generated schemas for validation
5. Add corresponding route handler in `artifacts/api-server/src/routes/`

### Database Changes

When modifying Drizzle schemas:

1. Edit schema in `lib/db/src/schema/`
2. Test with `pnpm --filter @workspace/db run push`
3. Create a migration file documenting the change (manually or via Drizzle kit)
4. Update docs if schema is user-facing

### Tool Additions

To add a new productivity tool:

1. Define metadata in `artifacts/api-server/src/lib/tools.ts`
2. Create route handler in `artifacts/api-server/src/routes/tools/`
3. Add Zod validation schema
4. Update `openapi.yaml`
5. Regenerate with `pnpm --filter @workspace/api-spec run codegen`
6. Implement frontend component in `artifacts/ai-productivity/src/components/tools/`
7. Test end-to-end: register → use tool → verify history entry

### Important Gotchas

- ⚠️ **Zod v3:** Pinned in pnpm catalog. OpenAPI spec must avoid `format: email` and use `type: number` (not `integer`)
- ⚠️ **bcryptjs:** Use instead of native bcrypt (pnpm build script restrictions)
- ⚠️ **Session TTL:** Currently 30 days; changing affects all active sessions

## 🎓 Learning Resources

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Express.js Guide](https://expressjs.com/)
- [React Hooks](https://react.dev/reference/react)
- [OpenAPI 3.0 Spec](https://spec.openapis.org/oas/v3.0.3)
- [Zod Documentation](https://zod.dev/)

## 🚀 Becoming a Maintainer

Regular contributors who show understanding of the codebase and community values may be invited to help maintain the project. This includes:

- Reviewing PRs
- Triaging issues
- Merging approved changes
- Leading feature discussions

## ❓ Questions?

- **General:** Open a [GitHub Discussion](https://github.com/frederick7778/chatGPT-and-I/discussions)
- **Bug Report:** [GitHub Issues](https://github.com/frederick7778/chatGPT-and-I/issues)
- **Security:** DO NOT open a public issue—email maintainer privately

---

Thank you for contributing to ToolKit AI! 🎉
