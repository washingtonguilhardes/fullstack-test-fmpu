# Clean Architecture & Domain-Driven Design Structure

This directory follows Clean Architecture principles and Domain-Driven Design (DDD) patterns to organize the codebase into well-defined domains with clear separation of concerns.

## Structure Overview

Each domain follows this structure:

```
src/domains/
├── {domain-name}/
│   ├── domain/           # Core business logic and entities
│   │   ├── {domain}.entity.ts
│   │   ├── {domain}.repository.ts
│   │   └── index.ts
│   ├── application/      # Use cases and application services
│   │   ├── {domain}.service.ts
│   │   └── index.ts
│   ├── infrastructure/   # External concerns (databases, HTTP, etc.)
│   │   ├── prisma/
│   │   │   └── {domain}.prisma.repository.ts
│   │   ├── controllers/
│   │   │   └── {domain}.controller.ts
│   │   ├── {domain}.module.ts
│   │   └── index.ts
│   └── index.ts
```

## Layers

### Domain Layer (`domain/`)
- **Entities**: Core business objects with behavior
- **Repository Interfaces**: Contracts for data access
- **Domain Services**: Business logic that doesn't belong to entities
- **Value Objects**: Immutable objects representing concepts

### Application Layer (`application/`)
- **Use Cases**: Application-specific business rules
- **Application Services**: Orchestrate domain objects and use cases
- **DTOs**: Data transfer objects for input/output
- **Command/Query Handlers**: Handle specific operations

### Infrastructure Layer (`infrastructure/`)
- **Repository Implementations**: Concrete implementations of repository interfaces
- **Controllers**: Handle HTTP requests and responses
- **Database**: Prisma schemas and migrations
- **External Services**: Third-party integrations
- **Configuration**: Environment-specific settings

## Current Domains

### User Domain
- **Purpose**: Manages user accounts, authentication, and profiles
- **Key Entities**: User
- **Key Operations**: Create, update, delete users, manage authentication

### Artifactory Domain
- **Purpose**: Manages file and folder storage, organization, and access
- **Key Entities**: Artifactory (files and folders)
- **Key Operations**: File upload, folder creation, access control, search

## Benefits

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Testability**: Easy to unit test business logic in isolation
3. **Maintainability**: Changes in one layer don't affect others
4. **Scalability**: Easy to add new domains or modify existing ones
5. **Team Collaboration**: Different teams can work on different layers
6. **Technology Independence**: Business logic is independent of frameworks

## Adding New Domains

1. Create the domain directory structure
2. Define domain entities and repository interfaces
3. Implement application services with use cases
4. Create infrastructure implementations (controllers, repositories)
5. Wire up the module with dependency injection
6. Add the module to `app.module.ts`

## Dependencies

- Domain layer has no dependencies on other layers
- Application layer depends only on domain layer
- Infrastructure layer depends on application and domain layers
- No circular dependencies allowed

## Testing Strategy

- **Domain Layer**: Unit tests for entities and business logic
- **Application Layer**: Unit tests for use cases and services
- **Infrastructure Layer**: Integration tests for repositories and controllers
- **End-to-End**: Full API testing with real database
