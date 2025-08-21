# Backend Architecture Documentation

## 🏗️ Architecture Overview

This Next.js application implements a **Domain-Driven Design (DDD)** architecture with clean separation of concerns, following enterprise-level patterns for scalability and maintainability.

### Core Architectural Principles

- **Domain-Driven Design (DDD)** - Business logic separated into domain layers
- **Repository Pattern** - Data access abstraction
- **Dependency Injection** - Loose coupling between components
- **Custom Error Handling** - Consistent error responses
- **JWT Authentication** - Secure token-based authentication with refresh token rotation

## 📁 Backend Structure

```
src/
├── app/api/                    # Next.js API Routes
│   ├── auth/                   # Authentication endpoints
│   └── users/                  # User management endpoints
├── domain/                     # Domain Layer (DDD)
│   └── user/                   # User domain
│       ├── entities/           # Domain entities & models
│       ├── repositories/       # Data access layer
│       └── services/           # Business logic layer
├── shared/                     # Shared Infrastructure
│   ├── auth.ts                 # Authentication utilities
│   ├── container/              # Dependency injection
│   ├── database/               # Database connection
│   └── errors/                 # Custom error classes
├── constants/                  # Route access configuration
├── middleware.ts               # Authentication & i18n middleware
└── types/                      # TypeScript type definitions
```

## 🎯 Domain Layer Architecture

### User Domain Structure

```
domain/user/
├── entities/
│   ├── user.entity.ts                    # User Mongoose model
│   ├── user.interface.ts                 # User interfaces
│   └── refresh-token-blacklist.entity.ts # Token blacklist model
├── repositories/
│   └── user.repository.ts                # Data access layer
└── services/
    ├── auth.service.ts                   # Authentication business logic
    └── user.service.ts                   # User management logic
```

### Entity Layer

**User Entity** (`user.entity.ts`)

- Mongoose schema with validation
- Password hashing middleware (bcrypt)
- JSON transformation (removes sensitive data)
- Password comparison method

**Refresh Token Blacklist Entity**

- JWT token invalidation tracking
- MongoDB TTL for automatic cleanup
- Prevents token reuse attacks

### Repository Layer

**UserRepository** (`user.repository.ts`)

```typescript
class UserRepository {
	async findByEmail(email: string): Promise<IUserDoc | null>;
	async findById(id: string): Promise<IUserDoc | null>;
	async create(user: IUser): Promise<IUserDoc>;
	async blacklistRefreshToken(
		jti: string,
		userId: string,
		expiresAt: Date,
	): Promise<void>;
	async isRefreshTokenBlacklisted(jti: string): Promise<boolean>;
}
```

### Service Layer

**AuthService** (`auth.service.ts`)

- User registration with duplicate email validation
- User login with password verification
- Refresh token rotation and blacklisting
- Token validation and user verification

**UserService** (`user.service.ts`)

- Current user retrieval
- User profile management
- Business logic for user operations

## 🔐 Authentication System

### JWT Token Strategy

**Access Token**

- Short-lived (1 minute)
- Contains user ID and role
- Stored in HTTP-only cookie
- Used for API authorization

**Refresh Token**

- Long-lived (7 days)
- Contains unique JTI (JWT ID)
- Enables token rotation
- Blacklisted after use

### Token Rotation Flow

1. **Login** → Generate access + refresh tokens
2. **Access Expired** → Use refresh token to get new pair
3. **Refresh Used** → Blacklist old token, issue new pair
4. **Logout** → Blacklist refresh token

### Security Features

- **HTTP-only Cookies** - Prevents XSS attacks
- **Token Blacklisting** - Prevents replay attacks
- **Automatic Expiration** - MongoDB TTL cleanup
- **Role-based Access** - Admin/User permissions

## 🛡️ Middleware & Route Protection

### Authentication Middleware (`middleware.ts`)

**API Route Protection**

```typescript
// Public routes: /api/auth/*
// Protected routes: /api/users/*
// Admin routes: /api/admin/*
```

**Page Route Protection**

```typescript
// Public pages: /auth/login, /auth/register
// Protected pages: /user/dashboard, /user/profile
// Admin pages: /admin/dashboard
```

### Route Access Configuration (`route-access.ts`)

```typescript
export const routeAccess: RouteAccessMap = {
	api: {
		public: ["/api/auth"],
		protected: ["/api/users"],
		admin: ["/api/admin"],
	},
	page: {
		public: ["/auth/login", "/auth/register"],
		protected: ["/user/dashboard", "/user/profile"],
		admin: ["/admin/dashboard"],
	},
};
```

## 🗄️ Database Layer

### MongoDB Connection (`database.ts`)

```typescript
export async function connectToDatabase(): Promise<typeof mongoose> {
	if (mongoose.connection.readyState >= 1) return mongoose;
	return mongoose.connect(process.env.MONGODB_URL!);
}
```

### Models & Schemas

**User Schema**

- Name validation (3-50 characters)
- Unique email constraint
- Password hashing pre-save hook
- Role-based access (admin/user)

**Refresh Token Blacklist Schema**

- JTI (unique token identifier)
- User ID reference
- TTL expiration for auto-cleanup

## 🚨 Error Handling System

### Custom Error Classes

**Base Error Class** (`custom-error.ts`)

```typescript
abstract class CustomError extends Error {
	abstract statusCode: number;
	abstract serializeErrors(): { field: string | null; message: string }[];
}
```

**Specific Error Types**

- `BadRequestError` (400) - Invalid requests
- `NotAuthorizedError` (401) - Authentication failures
- `ForbiddenError` (403) - Authorization failures
- `NotFoundError` (404) - Resource not found
- `RequestValidationError` (422) - Schema validation errors
- `InternalServerError` (500) - System errors

### Error Response Format

```typescript
{
  status: "fail",
  errors: [
    {
      field: "email" | null,
      message: "Error description"
    }
  ]
}
```

## 🔧 Dependency Injection

### DI Container (`di-container.ts`)

```typescript
const userRepository = new UserRepository(UserModel, RefreshTokenBlacklistModel);
const authService = new AuthService(userRepository);
const userService = new UserService(userRepository);

export const container = { authService, userService };
```

### Benefits

- **Loose Coupling** - Services depend on abstractions
- **Testability** - Easy to mock dependencies
- **Maintainability** - Single responsibility principle
- **Scalability** - Easy to extend with new services

## 📡 API Endpoints

### Authentication Routes

**POST** `/api/auth/register`

- User registration
- Email uniqueness validation
- Password hashing
- Returns user object (without password)

**POST** `/api/auth/login`

- User authentication
- Password verification
- JWT token generation
- Sets HTTP-only cookies

**POST** `/api/auth/logout`

- Token invalidation
- Refresh token blacklisting
- Cookie cleanup

**POST** `/api/auth/refresh`

- Token rotation
- Refresh token validation
- New token pair generation

### User Routes

**GET** `/api/users/currentuser`

- Protected route
- Returns current user data
- Requires valid access token

## 🔄 Request/Response Flow

### Authentication Flow

1. **Client** → Login request with credentials
2. **API Route** → Validates input with Zod schema
3. **AuthService** → Verifies credentials
4. **UserRepository** → Database query
5. **JWT Utils** → Generate tokens
6. **Response** → Set cookies + user data

### Protected Route Flow

1. **Middleware** → Validates access token
2. **API Route** → Extracts user from headers
3. **Service Layer** → Business logic execution
4. **Repository** → Database operations
5. **Response** → Formatted JSON response

## 🛠️ Development Patterns

### Schema Validation

- **Zod** for runtime type checking
- Input validation at API boundaries
- Type-safe request/response handling

### Error Boundaries

- Consistent error serialization
- HTTP status code mapping
- User-friendly error messages

### Database Patterns

- **Mongoose** ODM with TypeScript
- Schema-first approach
- Automatic validation and transformation

## 🚀 Scalability Considerations

### Horizontal Scaling

- Stateless authentication (JWT)
- Database connection pooling
- Microservice-ready architecture

### Performance Optimizations

- Connection reuse patterns
- Efficient database queries
- Token validation caching

### Security Best Practices

- Password hashing with salt
- Token rotation strategy
- HTTP-only cookie storage
- CORS and CSRF protection

## 🧪 Testing Strategy

### Unit Testing

- Service layer isolation
- Repository mocking
- Error handling validation

### Integration Testing

- API endpoint testing
- Database integration
- Authentication flow testing

## 📈 Monitoring & Logging

### Error Tracking

- Custom error serialization
- Structured error responses
- Development vs production logging

### Performance Monitoring

- Database query optimization
- Token validation metrics
- API response times

---

This architecture provides a solid foundation for enterprise-level applications with clear separation of concerns, robust security, and excellent maintainability.
