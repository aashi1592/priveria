# Contributing to DPIA Platform

Thank you for your interest in contributing to the DPIA Platform! This document provides guidelines and instructions for contributing.

## 🎯 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate in all interactions.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Lovable Cloud account or Supabase project
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/dpia-platform.git
   cd dpia-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Development Workflow

### Branching Strategy

We use a simplified Git Flow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards (see below)
   - Write tests for new features
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to GitHub and create a PR from your branch
   - Fill out the PR template completely
   - Link any related issues

## 📐 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types
- Document complex types with comments

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// ❌ Bad
const user: any = {};
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript interfaces for props

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick} className={variant}>{label}</button>;
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow the design system in `src/index.css`
- Use semantic color tokens (not direct colors)

```tsx
// ✅ Good
<div className="bg-background text-foreground border border-border">

// ❌ Bad
<div className="bg-white text-black border border-gray-300">
```

### File Organization

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── dashboard/   # Dashboard-specific components
│   └── enterprise/  # Enterprise feature components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── config/          # Configuration files
├── contexts/        # React contexts
└── lib/            # Utility functions
```

## 🧪 Testing

### Writing Tests

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click" onClick={handleClick} />);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 📚 Documentation

### Code Comments

- Document complex logic
- Use JSDoc for functions
- Keep comments up to date

```typescript
/**
 * Validates a DPIA assessment for compliance requirements
 * @param assessment - The DPIA assessment to validate
 * @returns Validation result with any errors
 */
export function validateAssessment(assessment: Assessment): ValidationResult {
  // Implementation
}
```

### Updating Documentation

- Update README.md for user-facing changes
- Update docs/ for architectural changes
- Include examples in documentation

## 🔍 Pull Request Guidelines

### PR Title Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
- `feat: add AI risk scoring module`
- `fix: resolve authentication redirect issue`
- `docs: update installation guide`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests pass

## Screenshots (if applicable)
[Add screenshots]

## Related Issues
Fixes #123
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline must pass
   - No linting errors
   - All tests pass

2. **Code Review**
   - At least one maintainer approval required
   - Address all review comments
   - Keep discussions constructive

3. **Merging**
   - Squash commits if requested
   - Update CHANGELOG.md
   - Delete branch after merge

## 🐛 Reporting Bugs

### Before Submitting

- Check existing issues
- Test on the latest version
- Gather reproduction steps

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox]
- Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information
```

## 💡 Feature Requests

### Proposing New Features

1. **Open a discussion**
   - Use GitHub Discussions
   - Explain the use case
   - Gather community feedback

2. **Create a feature request**
   - Clear description
   - Use case examples
   - Mockups if applicable

3. **Implementation proposal**
   - Technical approach
   - Breaking changes
   - Migration path

## 🏆 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- CONTRIBUTORS.md file

## 📞 Getting Help

- **GitHub Discussions**: General questions
- **Discord**: Real-time chat
- **Email**: For sensitive issues

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to DPIA Platform! 🎉
