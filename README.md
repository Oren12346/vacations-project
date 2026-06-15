# Vacations Project - Oren Meshulam

Full Stack Vacations Management Project built with React, TypeScript, Node.js, Express, MySQL, Redux Toolkit, Docker, OpenAI API, and MCP.

## Main Features

### User
- Register and log in with JWT authentication.
- View all vacations.
- Filter vacations by all, liked, active, and upcoming.
- Like and unlike vacations.
- Get an AI-based vacation recommendation.
- Ask database questions through MCP tools.

### Admin
- Add new vacations with image upload.
- Edit existing vacations, including optional image replacement.
- Delete vacations.
- View vacation likes reports.
- Export reports to CSV.

## Technologies

### Frontend
- React
- TypeScript
- Vite
- React Router
- Redux Toolkit
- Axios
- Recharts

### Backend
- Node.js
- Express
- TypeScript
- MySQL2
- JWT
- bcrypt
- multer
- OpenAI API
- MCP SDK

### Database / DevOps
- MySQL
- Docker
- Docker Compose
- Postman

## Project Structure

```text
vacations-project-Oren-Meshulam/
├── Backend/
│   ├── src/
│   │   ├── 1-models/
│   │   ├── 2-utils/
│   │   ├── 3-services/
│   │   ├── 4-middleware/
│   │   ├── 5-routes/
│   │   ├── 7-mcp/
│   │   ├── app.ts
│   │   └── assets/images/
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── 1-models/
│   │   ├── 2-utils/
│   │   ├── 3-services/
│   │   ├── pages/
│   │   └── store/
│   └── package.json
├── Database/
│   └── vacations_db.sql
├── compose.yaml
├── .env.example
└── Vacation Project.postman_collection.json
```

## Environment Variables

The real `.env` file is intentionally not included in the project because it can contain private secrets such as `OPENAI_API_KEY` and `JWT_SECRET`.

Use the provided example file:

```bash
cp .env.example .env
```

Then fill in your real values.

Example structure:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TempPass123!
DB_NAME=vacations_db
JWT_SECRET=replace_with_your_secret
OPENAI_API_KEY=replace_with_your_openai_api_key
AI_MODEL=gpt-5.4
FRONTEND_URL=http://localhost:5173
```

For local backend development from inside the `Backend` folder, create a local `Backend/.env` file using `Backend/.env.example` as the template.

Do not upload real `.env` files to GitHub.

## Run with Docker

From the project root:

```bash
docker compose up -d --build
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:4000
```

Images are served from:

```text
http://localhost:4000/images/
```

If the database schema changes and you need to recreate the database container:

```bash
docker compose down -v
docker compose up -d --build
```

## Run Locally Without Docker

### Backend

```bash
cd Backend
npm install
cp .env.example .env
npm start
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Database

The database initialization file is located at:

```text
Database/vacations_db.sql
```

When running with Docker, MySQL loads this file automatically through Docker Compose.

## API / Postman

A Postman collection is included:

```text
Vacation Project.postman_collection.json
```

Recommended flow:

1. Register or log in.
2. Copy the JWT token from the response.
3. Use it in protected requests with the `Authorization` header:

```text
Bearer <token>
```

## Important Implementation Notes

- Backend routes are separated by feature area.
- Backend services and utilities are organized with classes.
- Global error handling is handled by `catch-all` middleware.
- Vacation images are uploaded using multer and saved with UUID filenames.
- Uploaded images are stored under `Backend/src/assets/images`.
- The frontend stores the authenticated user and vacations list in Redux.
- Vacation like/unlike operations update Redux immediately after server success.
- Admin add, edit, and delete operations update Redux after server success.
- AI and MCP features require a valid OpenAI API key.

## Security Notes

- Real `.env` files are ignored and should never be committed.
- `.env.example` is safe to commit because it contains placeholders only.
- Passwords are hashed with bcrypt.
- Protected routes require a valid JWT.
- Admin routes require both login and admin role verification.

## Author

Oren Meshulam
