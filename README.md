# BugTracker (GROUP PROJECT)
## Project Description:
Bug Tracking System is an application that enables IT teams to efficiently report, track, and manage bugs and other software issues.

**Poject is currently under development.**

## Features:
- **Issue Registration** – Ability to add new bug reports with description, priority, and category.
- **Issue Assignment** – Assigning bugs to specific team members.
- **Status Tracking** – Monitoring issue statuses (e.g., New, In Progress, Resolved, Closed).
- **Issue Prioritization** – Marking issues with priorities (e.g., Low, Medium, High, Critical).
- **Change History** – Tracking changes in the issue, e.g., status change, description edit.
- **Filtering and Searching** – Advanced options for filtering and searching issues.
- **Registration/Login** - Creating a new user with appropriate roles and encrypted password in the database, as well as logging in before submitting a report.

## Technologies:
- **Frontend:** Angular / TypeScript
- **Backend:** Java / Spring Boot
- **Database:** PostgreSQL

## Installation and Setup

### Prerequisites
- Node.js and npm
- Angular CLI
- Java JDK 21+
- Maven

### Database
1. Navigate to the database_setup directory
2. Create and run database container in Docker:
```
docker compose up
```

### Frontend
1. Navigate to the frontend directory (frontend/bugtracker)
2. Install dependencies:
```
npm install
```
3. Run the application:
```
ng serve
```
4. The application will be available at: `http://localhost:4200/`

### Backend
1. Navigate to the backend directory (/bugtracker)
2. Build the project:
```
.\mvnw clean install
```
3. Run the application:
```
.\mvnw spring-boot:run
```
4. The API will be available at: `http://localhost:8080/`
