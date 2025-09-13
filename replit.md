# Overview

ZeroWasteRescue (FoodBridge) is a food waste reduction platform that connects food providers (hotels, restaurants, hostels, catering services) with NGOs to reduce food waste and help communities. The platform enables providers to register surplus food donations and NGOs to find and claim available food listings, facilitating direct communication through an integrated chat system.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with route-based code splitting
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system supporting light/dark modes
- **State Management**: TanStack Query for server state and React hooks for local state
- **Form Handling**: React Hook Form with Zod validation schemas

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Session-based authentication using express-session with bcrypt password hashing
- **API Design**: RESTful API with consistent error handling and logging middleware
- **File Structure**: Modular architecture with separate routes, storage layer, and database configuration
- **Authorization**: Role-based access control (Provider, NGO, Admin) with verification requirements for NGOs

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL
- **Schema**: Relational database with three main entities:
  - Users (providers, NGOs, admins) with verification status
  - Food listings with claim status and urgency levels
  - Messages for chat functionality between users
- **Enums**: Type-safe enums for user types, urgency levels, and claim statuses
- **Relationships**: Foreign key relationships with proper cascade handling

## Key Features
- **Multi-role Authentication**: Separate login flows for providers and NGOs with admin verification
- **Food Listing Management**: CRUD operations with filtering by location, urgency, and food type
- **Real-time Communication**: Chat interface for coordination between providers and NGOs
- **Admin Panel**: NGO verification system with approval/rejection workflows
- **Responsive Design**: Mobile-first approach with consistent component design

## Design System
- **Color Palette**: Sustainable green theme with proper contrast ratios for accessibility
- **Typography**: Inter font family for optimal readability
- **Component Library**: Comprehensive UI components with consistent spacing and interaction patterns
- **Theme Support**: Light and dark mode with CSS custom properties

# External Dependencies

## Database
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Drizzle Kit**: Database migration and schema management tools

## UI Framework
- **Radix UI**: Headless UI components for accessibility and consistent behavior
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography

## Authentication & Security
- **bcrypt**: Password hashing for secure authentication
- **express-session**: Session management with PostgreSQL store
- **connect-pg-simple**: PostgreSQL session store adapter

## Development Tools
- **Vite**: Fast development server and build tool with React plugin
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **TanStack Query**: Data fetching and caching with optimistic updates

## Validation & Forms
- **Zod**: Schema validation for API endpoints and form data
- **React Hook Form**: Performance-optimized form handling with validation
- **@hookform/resolvers**: Integration between React Hook Form and Zod

## Communication
- **Real-time Features**: Planned WebSocket integration for live chat functionality
- **API Communication**: Fetch-based API client with credential handling and error management