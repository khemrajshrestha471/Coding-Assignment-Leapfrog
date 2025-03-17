# Note Taking Application - Backend

This is the **backend** of the Note Taking Application, built with **Node.js** and **Express.js**. It defines all API routes, uses **Swagger** for API documentation, and includes a **Dockerfile** for containerization. The backend is well-tested with **Postman**.

---

## Folder Structure

```
/backend
│── index.js               # Entry point - defines API routes, CORS, and server start
│── Dockerfile             # Docker configuration
│── api/                   # Contains all endpoint code
│   ├── login.js           # Handles user login (POST)
│   ├── signup.js          # Handles new user registration (POST)
│   ├── ... 13 more files defining endpoints
└── .env                   # Environment variables
```

---

## Set Up Environment Variables

Create a `.env` file in `/backend` and add:

```
PORT = your_backend_port
FRONTEND_URL = your_frontend_url
DB_USER = your_database_user
DB_HOST = your_database_host
DB_NAME = your_database_name
DB_PASSWORD = your_database_password
DB_PORT = your_database_port
JWT_SECRET = your_jwt_secret
SESSION_SECRET = your_session_secret
EMAIL = your_email_to_send_otp
PASSWORD = your_password_setup_for_opt_configuration
```

---

## API Endpoints

| Method | Endpoint  | Description |
|--------|----------|-------------|
| `POST` | `/api/login/enter` | User login |
| `POST` | `/api/signup/register` | User registration |
| `GET`  | `/api/fetchNote/notes/${user_id}?page=${page}&limit=${limit}` | Fetch notes |
| `POST` | `/api/addNote/add-note` | Create a new note |
| `PUT`  | `/api/updateNote/update-note/${user_id}/${note_id}` | Update a note |
| `DELETE` | `/api/deleteNote/delete-note/${user_id}/${note_id}` | Delete a note |
| ...    | **9 More Endpoints** | ... |

Full API documentation is available in [**Swagger**](http://20.197.52.87:4000/api-docs/#/default).