# ViewLog

## Project Description

**ViewLog** is a simple web application where users can log in to their accounts and track their viewing history for movies, dramas, variety shows, and animations. Users can add, edit update, and delete their viewing records, allowing them to track their progress across different types of media.

This project is developed using a modern web stack and is designed as a side project to practice full-stack development skills.

## Features

- User Registration and Login
- User Profile Management (Update user information)
- CRUD operations for tracking movie, drama, variety show, and animation progress
- Persistent storage of viewing history using SQLite
- RESTful API for managing user data and viewing records

## Technologies Used
- **Frontend:** React.js, HTML, CSS
- **Backend:** Node.js, Express.js
- **Database:** SQLite (for storing records)
- **Styling:** Custom CSS
- **Version Control:** Git, GitHub

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
| GET    | `/api/records`      | Get viewing records for a user   |
| POST   | `/api/records`      | Add a new viewing record         |
| PUT    | `/api/records/:id`  | Update an existing viewing record|
| DELETE | `/api/records/:id`  | Delete a viewing record          |

### Future Enhancements

- Add authentication using JWT for protected routes.
- Allow users to categorize media into genres.
- Add filtering and sorting for viewing records.
- Implement notifications to remind users about ongoing series.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.