# Next.js Fullstack architecture Template

A production-ready Next.js template featuring modern architecture patterns, complete authentication system, and scalable project structure. Built with TypeScript, Domain-Driven Design principles, and enterprise-level best practices.

## 🚀 Features

- ✅ **Complete Authentication System** (JWT-based with HTTP-only cookies)
- ✅ **Domain-Driven Design Architecture** with clean separation of concerns
- ✅ **Type-Safe API** with Zod validation and TypeScript
- ✅ **Modern State Management** using Redux Toolkit + RTK Query
- ✅ **Protected Routes** with Next.js middleware
- ✅ **Form Handling** with React Hook Form and validation
- ✅ **Error Handling** with custom error classes
- ✅ **MongoDB Integration** with Mongoose
- ✅ **Responsive UI** with Tailwind CSS
- ✅ **Developer Experience** optimized with ESLint, Prettier, and Turbopack

## 🏗️ Project Structure

```
src/
├── app/(client)/           # App Router client pages (Route Groups)
│   ├── auth/              # Authentication pages (login, register)
│   ├── dashboard/         # Protected dashboard page
│   └── layout.tsx         # Root layout with providers
├── app/api/               # API Routes
│   ├── auth/              # Authentication endpoints
│   └── users/             # User management endpoints
├── components/            # Shared UI components
├── domain/                # Domain layer (DDD pattern)
│   └── user/              # User domain with entities, repos, services
├── features/              # Feature modules
│   └── auth/              # Authentication feature module
├── shared/                # Shared utilities and infrastructure
│   ├── auth/              # Authentication utilities
│   ├── container/         # Dependency injection container
│   ├── database/          # Database connection
│   └── errors/            # Custom error classes
└── store/                 # Redux store configuration
```

## 🛠️ Tech Stack

### Core Technologies

- **Next.js 15.4.5** - React framework with App Router & Turbopack
- **React 19.1.0** - UI library
- **TypeScript 5.x** - Type safety
- **Tailwind CSS 4.1.11** - Styling

### State Management

- **Redux Toolkit 2.8.2** - State management
- **RTK Query** - API state and caching
- **React Redux 9.2.0** - React integration

### Authentication & Security

- **JWT** (jose, jsonwebtoken) - Token-based authentication
- **bcryptjs** - Password hashing
- **Zod 4.0.14** - Schema validation

### Database & Backend

- **MongoDB** - Database
- **Mongoose 8.17.0** - ODM with custom repository pattern

### Form Handling

- **React Hook Form 7.61.1** - Form management
- **@hookform/resolvers** - Schema integration

### Developer Experience

- **ESLint + Prettier** - Code quality and formatting
- **TypeScript** - Static type checking
- **Path aliases** (`@/*`) - Clean imports

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd next-job-board
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏛️ Architecture Patterns

### Domain-Driven Design (DDD)

- **Domain Layer**: Business logic and entities
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business operations
- **Dependency Injection**: Loose coupling with custom DI container

### Security Best Practices

- **JWT with HTTP-only cookies** for secure token storage
- **Password hashing** with bcrypt
- **Request validation** with Zod schemas
- **Custom error handling** preventing information leakage
- **Route protection** with Next.js middleware

### Performance Optimizations

- **Turbopack** for faster development builds
- **RTK Query** for automatic caching and background refetching
- **Route Groups** for organized routing
- **Middleware** for efficient auth checks

## 📱 Use Cases

This template is perfect for:

- ✅ **Job Boards & Career Platforms**
- ✅ **SaaS Dashboards** with user authentication
- ✅ **E-commerce Platforms** (user management foundation)
- ✅ **Content Management Systems**
- ✅ **Multi-tenant Applications**
- ✅ **Any CRUD-heavy web application**

## 🔐 Authentication Flow

1. **Registration/Login** - Secure user authentication
2. **JWT Token Generation** - Access and refresh tokens
3. **HTTP-only Cookies** - Secure token storage
4. **Middleware Protection** - Route-level authentication
5. **Automatic Token Refresh** - Seamless user experience

## 📝 API Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh
- `GET /api/users/currentuser` - Get current user

## 🎨 UI Components

- Responsive design with Tailwind CSS
- Form components with validation
- Toast notifications for user feedback
- Loading states and error handling
- Clean and modern interface

## 🧪 Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🌟 Key Features Explained

### Feature-Based Architecture

Each feature (auth, jobs, etc.) is self-contained with its own:

- Components
- Services
- Types
- Schemas
- Hooks

### Type Safety

- End-to-end TypeScript coverage
- Zod schema validation
- Type-safe API responses
- IntelliSense support

### Error Handling

- Custom error classes for different scenarios
- Consistent API error responses
- User-friendly error messages
- Proper HTTP status codes

### State Management

- Server state with RTK Query
- Client state with Redux Toolkit
- Authentication context
- Optimistic updates

## 🤝 Contributing

This template follows clean architecture principles. When adding new features:

1. Follow the feature-based folder structure
2. Implement proper domain separation
3. Add appropriate error handling
4. Include type definitions
5. Write validation schemas

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Next.js, TypeScript, and modern web development practices.**
