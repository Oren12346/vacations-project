# Oren Meshulam - Project 3

## GitHub Repository
https://github.com/Oren12346/vacations-project

# Vacations Project

## Description
A full-stack web application for managing and viewing vacations.

Users can:
- View available vacations
- Like / unlike vacations
- Get AI-based recommendations
- Ask questions about the database (MCP)

Admin users can:
- Add vacations
- Edit vacations (including images)
- Delete vacations
- View reports

---

## Technologies
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: MySQL
- State Management: Redux Toolkit
- API Testing: Postman
- Containerization: Docker

---

## Run the Project (Docker)

```bash
docker compose up -d --build


Frontend:
http://localhost:5173

Backend:
http://localhost:4000


Environment Variables

Create .env inside Backend:

PORT=4000
DB_HOST=database
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TempPass123!
DB_NAME=vacations_db
JWT_SECRET=your_secret
OPENAI_API_KEY=your_key
Database

The database is automatically created using:

Database/vacations_db.sql
Postman

Postman collection is included in:

Vacation Project.postman_collection.json

Use:

Login request to get token
Other requests use Authorization header
Notes

Images are served from:
http://localhost:4000/images/

The system is case-sensitive (Linux Docker environment)

If updating the SQL file, run:

docker compose down -v
docker compose up -d --build