# ViewLog

## Project Description

**ViewLog** is a simple web application where users can log in to their accounts and track their viewing history for movies, TV shows, variety shows, and animations. Users can add, edit, and update their viewing records, allowing them to track their progress across different types of media.

This project is developed using a modern web stack and is designed as a side project to practice full-stack development skills.

## Features

- User Registration and Login
- User Profile Management (Update user information)
- CRUD operations for tracking movie, TV show, variety show, and animation progress
- Persistent storage of viewing history using SQLite
- RESTful API for managing user data and viewing records

## Tech Stack

### Frontend:
- **React.js**: A popular JavaScript library for building user interfaces.
- **Next.js**: A React framework that enables static site generation (SSG) and server-side rendering (SSR) for better performance and SEO.

### Backend:
- **Node.js**: A JavaScript runtime for executing server-side code.
- **Express.js**: A minimal and flexible Node.js web application framework for creating RESTful APIs.

### Database:
- **SQLite**: A lightweight, serverless, self-contained database engine suitable for small-scale projects.

## Project Setup

### Prerequisites

To run this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- npm (Node package manager)
- SQLite (optional; SQLite will be automatically initialized with the project)

### Project Structure

```bash
viewlog/
├── frontend/     # React + Next.js frontend code
├── backend/      # Express.js backend code
├── database/     # SQLite database (automatically generated)
└── README.md     # Project documentation
```

### API Routes

| Method | Endpoint            | Description                      |
|--------|---------------------|----------------------------------|
| POST   | `/api/register`      | Register a new user              |
| POST   | `/api/login`         | Log in an existing user          |
| GET    | `/api/viewlogs`      | Get viewing records for a user   |
| POST   | `/api/viewlogs`      | Add a new viewing record         |
| PUT    | `/api/viewlogs/:id`  | Update an existing viewing record|
| DELETE | `/api/viewlogs/:id`  | Delete a viewing record          |

### Future Enhancements

- Add authentication using JWT for protected routes.
- Allow users to categorize media into genres.
- Add filtering and sorting for viewing records.
- Implement notifications to remind users about ongoing series.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.