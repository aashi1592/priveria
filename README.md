# 🛡️ DPIA Platform - Privacy Impact Assessment Management

> **Open Source DPIA Platform** with Enterprise AI capabilities for modern privacy compliance

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Lovable Cloud](https://img.shields.io/badge/Lovable-Cloud-purple)](https://lovable.dev)

A comprehensive Data Protection Impact Assessment (DPIA) platform that helps organizations comply with GDPR, manage privacy risks, and protect personal data. Available as **open source (community edition)** with optional **enterprise AI features**.

---

## 🌟 Features

### ✅ **Community Edition** (Open Source - Always Free)

- **Core DPIA Management**: Create, track, and manage comprehensive DPIAs
- **Risk Assessment**: Manual risk scoring and mitigation tracking
- **Vendor Management**: Track third-party data processors
- **Compliance Frameworks**: GDPR, CCPA, ISO 27701 support
- **Reporting**: Generate standard DPIA reports (PDF, JSON)
- **Multi-user Support**: Team collaboration with role-based access
- **Audit Trail**: Track all changes and assessments

### 🔐 **Enterprise Edition** (License Required)

- **AI-Powered Risk Scoring**: Automated risk assessment using ML
- **LINDDUN Threat Modeling**: Advanced privacy threat analysis
- **AI Vendor Recommendations**: Intelligent vendor risk analysis
- **AI Document Analysis**: Automated document scanning
- **GRC Integrations**: OneTrust, ServiceNow, Archer sync
- **W3C DPV Ontology**: Standardized data vocabulary
- **CI/CD Policy Enforcement**: Automated compliance checks
- **Cryptographic Audit Trail**: Tamper-proof logging
- **Priority Support**: SLA-backed enterprise support

[**→ Compare Editions**](#community-vs-enterprise)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ & npm/yarn
- Lovable Cloud account (or Supabase project)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourorg/dpia-platform.git
cd dpia-platform

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure your backend connection (see Configuration section)
# Edit .env with your Lovable Cloud or Supabase credentials

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

---

## ⚙️ Configuration

### 1. **Backend Setup**

The platform requires a backend for data persistence. You have two options:

#### **Option A: Lovable Cloud** (Recommended)

1. Create a free account at [lovable.dev](https://lovable.dev)
2. Enable Lovable Cloud in your project
3. Your `.env` is auto-configured - no additional setup needed!

#### **Option B: Self-Hosted Supabase**

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the database migrations:
   ```bash
   npm run db:migrate
   ```
3. Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
   ```

### 2. **Environment Variables**

Edit `.env` file:

```bash
# Required (Backend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

# Optional (Enterprise)
VITE_LICENSE_KEY=your_enterprise_license_key
LOVABLE_API_KEY=your_ai_api_key

# Optional (Integrations)
ONETRUST_API_KEY=your_onetrust_key
ONETRUST_ORG_ID=your_org_id
```

---

## 📚 Documentation

- **[Installation Guide](docs/INSTALLATION.md)** - Detailed setup instructions
- **[Configuration Guide](docs/CONFIGURATION.md)** - Environment and feature configuration
- **[API Reference](docs/API_REFERENCE.md)** - REST API documentation
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design and architecture
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  (TypeScript, Tailwind CSS, shadcn/ui)                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Feature Flag System                         │
│  (Controls Community vs Enterprise features)            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                Lovable Cloud / Supabase                  │
│  • PostgreSQL Database (RLS enabled)                    │
│  • Authentication & User Management                      │
│  • Edge Functions (License validation, AI)              │
│  • File Storage                                          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│           Enterprise Integrations (Optional)             │
│  • OneTrust • ServiceNow • Lovable AI                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| **Frontend**   | React 18, TypeScript, Vite             |
| **UI**         | Tailwind CSS, shadcn/ui                |
| **Backend**    | Lovable Cloud (Supabase)               |
| **Database**   | PostgreSQL with RLS                     |
| **Auth**       | Supabase Auth                           |
| **AI**         | Lovable AI (Gemini 2.5, GPT-5)         |
| **Deployment** | Lovable Cloud, Vercel, Docker          |

---

## 🔐 Community vs Enterprise

| Feature                          | Community | Enterprise |
|----------------------------------|-----------|------------|
| Core DPIA Management             | ✅        | ✅         |
| Risk Assessment (Manual)         | ✅        | ✅         |
| Vendor Management                | ✅        | ✅         |
| Basic Reporting                  | ✅        | ✅         |
| **AI Risk Scoring**              | ❌        | ✅         |
| **LINDDUN Threat Modeling**      | ❌        | ✅         |
| **AI Document Analysis**         | ❌        | ✅         |
| **GRC Integrations**             | ❌        | ✅         |
| **W3C DPV Ontology**             | ❌        | ✅         |
| **CI/CD Policy Enforcement**     | ❌        | ✅         |
| **Cryptographic Audit Trail**    | ❌        | ✅         |
| **Priority Support**             | ❌        | ✅         |

**[→ Get Enterprise License](mailto:enterprise@yourcompany.com)**

---

## 🧪 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Run database migrations
npm run db:migrate

# Generate type definitions
npm run db:types
```

---

## 🐳 Docker Deployment

```bash
# Build and run with docker-compose
docker-compose up -d

# Access at http://localhost:8080
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment guides.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Development process:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

**Enterprise features** require a separate commercial license.

---

## 🆘 Support

### Community Support (Free)
- **GitHub Discussions**: [github.com/yourorg/dpia-platform/discussions](https://github.com/yourorg/dpia-platform/discussions)
- **Documentation**: [docs.yourcompany.com](https://docs.yourcompany.com)
- **Discord**: [discord.gg/dpia-platform](https://discord.gg/dpia-platform)

### Enterprise Support
- **Email**: enterprise@yourcompany.com
- **SLA**: 24/7 support with guaranteed response times
- **Dedicated Account Manager**

---

## 🗺️ Roadmap

### Q1 2025
- [ ] Mobile app (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

### Q2 2025
- [ ] ISO 27001 integration
- [ ] Automated vendor discovery
- [ ] Real-time collaboration

### Q3 2025
- [ ] Blockchain audit trail
- [ ] Zero-knowledge encryption
- [ ] Compliance marketplace

[**→ View Full Roadmap**](https://github.com/yourorg/dpia-platform/projects)

---

## 🌟 Sponsors

This project is made possible by:
- [Lovable](https://lovable.dev) - Cloud infrastructure
- [Supabase](https://supabase.com) - Backend services

[**→ Become a Sponsor**](https://github.com/sponsors/yourorg)

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourorg/dpia-platform?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourorg/dpia-platform?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourorg/dpia-platform)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourorg/dpia-platform)

---

## 📧 Contact

- **Website**: [yourcompany.com](https://yourcompany.com)
- **Email**: hello@yourcompany.com
- **Twitter**: [@yourcompany](https://twitter.com/yourcompany)
- **LinkedIn**: [company/yourcompany](https://linkedin.com/company/yourcompany)

---

<div align="center">

**Built with ❤️ using [Lovable](https://lovable.dev)**

[Get Started](#-quick-start) · [Documentation](docs/) · [Report Bug](https://github.com/yourorg/dpia-platform/issues)

</div>
