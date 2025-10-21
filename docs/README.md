# LeaderDashboard Documentation

Welcome to the LeaderDashboard documentation. This directory contains comprehensive documentation for the AI-powered executive dashboard system.

## Documentation Index

### Architecture Documentation

- **[ARCHITECTURE.md](./architecture/ARCHITECTURE.md)** - Comprehensive architecture documentation including:
  - System overview
  - Component details
  - Technology stack
  - Data flows
  - Security considerations
  - Future enhancements

- **[DIAGRAMS.md](./architecture/DIAGRAMS.md)** - Visual architecture diagrams including:
  - System architecture overview
  - Agent workflow sequences
  - LangGraph state machines
  - Data flow diagrams
  - Component hierarchies
  - Deployment architecture
  - Request-response cycles

## Quick Links

### For Developers
- [System Architecture Overview](./architecture/ARCHITECTURE.md#overview)
- [Component Details](./architecture/ARCHITECTURE.md#component-details)
- [Data Flow](./architecture/ARCHITECTURE.md#data-flow)
- [Project Structure](./architecture/ARCHITECTURE.md#project-structure)

### For DevOps
- [Deployment Architecture](./architecture/DIAGRAMS.md#8-deployment-architecture)
- [Technology Stack](./architecture/ARCHITECTURE.md#technology-stack)
- [Configuration](./architecture/ARCHITECTURE.md#configuration)

### For Architects
- [High-Level Architecture](./architecture/DIAGRAMS.md#1-system-architecture-overview)
- [Agent Orchestration](./architecture/DIAGRAMS.md#2-agent-query-processing-flow)
- [Scalability Considerations](./architecture/ARCHITECTURE.md#scalability-considerations)
- [Future Microservices Design](./architecture/DIAGRAMS.md#13-future-architecture-with-microservices)

## Document Organization

```
docs/
├── README.md                    # This file - documentation index
└── architecture/
    ├── ARCHITECTURE.md          # Detailed architecture documentation
    └── DIAGRAMS.md              # Mermaid architecture diagrams
```

## How to Use This Documentation

1. **New to the project?** Start with [ARCHITECTURE.md](./architecture/ARCHITECTURE.md#overview)
2. **Need visual representation?** Check [DIAGRAMS.md](./architecture/DIAGRAMS.md)
3. **Implementing a feature?** Review [Component Details](./architecture/ARCHITECTURE.md#component-details)
4. **Troubleshooting?** See [Error Handling Flow](./architecture/DIAGRAMS.md#11-error-handling-flow)
5. **Planning deployment?** Read [Deployment Architecture](./architecture/ARCHITECTURE.md#deployment-architecture)

## Viewing Mermaid Diagrams

The diagrams in DIAGRAMS.md use Mermaid syntax. You can view them:

1. **GitHub**: Renders automatically when viewing on GitHub
2. **VS Code**: Install the "Markdown Preview Mermaid Support" extension
3. **Online**: Use [Mermaid Live Editor](https://mermaid.live/)
4. **IntelliJ/PyCharm**: Install Mermaid plugin

## Contributing to Documentation

When updating documentation:

1. Keep diagrams synchronized with code changes
2. Update both narrative documentation and diagrams
3. Add examples where helpful
4. Maintain consistent terminology
5. Include version information for major changes

## Documentation Conventions

- **Architecture diagrams**: Use Mermaid format
- **Code examples**: Include file paths and line references
- **Configuration**: Show both example and production values
- **External links**: Always verify links are current

## Related Resources

- [Main Project README](../healthcare_sciences_dashboard/readme.md) - Quick start guide
- [API Documentation](http://localhost:8000/docs) - Interactive API docs (when server running)
- Frontend Dashboard - Open `ceo_dashboard_complete.html` in browser

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-21 | Initial documentation creation |

## Support

For questions or clarifications about the architecture:
1. Review the documentation thoroughly
2. Check code comments in relevant files
3. Contact the development team

---

**Last Updated**: October 21, 2025
**Maintained By**: Development Team
**Project**: LeaderDashboard - AI-Powered Executive Dashboard
