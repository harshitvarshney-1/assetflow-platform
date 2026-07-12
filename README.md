# AssetFlow – Enterprise Asset & Resource Management System

## 🚨 STRICT ARCHITECTURAL FREEZE RULE
The folder structures of both `assetflow-frontend` and `assetflow-backend` have been architecturally frozen. 
- **NO new directories or top-level folders** must be created unless explicitly requested by the architect.
- All future development, components, utilities, business models, and endpoints must be strictly placed within the established modular/package layout.

---

## Technical Stack
- **Frontend**: React 19, Vite, Tailwind CSS, React Router, Recharts, React Hook Form, Zod
- **Backend**: Java 21, Spring Boot 3, Spring Security, JWT, JPA, PostgreSQL, Flyway, Testcontainers

## Folder Layout Summary

```text
├── assetflow-frontend/        # React 19 Frontend App
│   ├── public/                # Static public entries
│   └── src/
│       ├── assets/            # Fonts, media assets
│       ├── components/        # Reusable global UI (atomic level)
│       ├── layouts/           # Page frameworks (Sidebar, Admin Frame)
│       ├── pages/             # Route containers
│       ├── modules/           # Isolated business verticals (auth, booking, asset...)
│       ├── hooks/             # Utility hooks
│       ├── services/          # API network clients (Axios)
│       ├── context/           # Global states
│       ├── routes/            # Route security and guards
│       ├── utils/             # Algorithms and parsers
│       ├── constants/         # Immutables
│       ├── types/             # Common typings
│       └── styles/            # CSS tokens
│
└── assetflow-backend/         # Spring Boot 3 Backend
    └── src/
        ├── main/
        │   ├── java/com/assetflow/
        │   │   ├── config/      # Framework configs
        │   │   ├── security/    # JWT & Endpoint authentication matrices
        │   │   ├── exception/   # Universal controller exception boundaries
        │   │   ├── entity/      # Shared JPA abstractions
        │   │   ├── repository/  # Shared database layers
        │   │   ├── service/     # Shared business interfaces
        │   │   ├── controller/  # Root endpoints
        │   │   ├── dto/         # Common serialization containers
        │   │   ├── mapper/      # Serialization adapters (MapStruct)
        │   │   ├── validation/  # Cross-cutting validators
        │   │   ├── util/        # Internal developer utilities
        │   │   └── modules/     # Package-By-Feature isolates (auth, category, allocation...)
        │   └── resources/
        │       ├── db/migration # Database Flyway migration tracking scripts
        │       └── application.yml
        └── test/                # Unit, integration, and container test suits
```