# AvorisApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 19.2.7.

## Getting Started

### Prerequisites

- Node.js and npm
- Docker (for containerization)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the application locally

Start the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma/Jasmine] 

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Docker Implementation

### Building the Docker image

```bash
docker build -t avoris-app .
```

### Running the Docker container

```bash
docker run -p 8080:80 avoris-app
```

After running the container, access the application at `http://localhost:8080`.

## Best Practices

- Keep components small and focused on a single responsibility
- Use services for data fetching and business logic
- Implement lazy loading for large applications
- Follow Angular style guide for naming conventions and project structure
- Write unit tests for critical functionality
- Use environment files for environment-specific configuration
- Implement proper error handling and loading states
- Use Angular's built-in security features to prevent common vulnerabilities

## Project Structure
    src/
    ├── app/
    │   ├── core/       # Singleton services, app-level components
    │   ├── features/   # Feature modules
    │   ├── shared/     # Shared components, directives, pipes
    │   └── app.module.ts
    ├── assets/
    ├── environments/
    └── index.html
