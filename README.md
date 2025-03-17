# Note Taking Application | Leapfrog

## Overview

This is a full-stack web application designed for note-taking, featuring a responsive user interface and a robust backend. The application allows users to create, edit, delete, and view notes. It also includes an authentication system with login and signup functionalities, send **OTP** for verification and secured with **JSON Web Tokens (JWT)** and **localStorage**. The application is **dockerized** and **deployed** the dockerized image to the cloud (**Azure**), whose url is [this](http://leapfrog-note-taker.khemrajshrestha.com.np).

---

## Setup Instructions without Docker


- Clone this repository.
```sh
git clone https://github.com/khemrajshrestha471/Coding-Assignment-Leapfrog.git
cd Coding-Assignment-Leapfrog
```

- Add `.env` file credentials to all required paths.
- Install frontend dependencies by chnage directory to `/frontend` and run `npm install`.
- Install backend dependencies (in a new terminal) by `/backend` and run `npm install`.
- Ensure all dependencies are installed and versions matches the `package.json`.
- Start the frontend (first terminal) by running `npm run dev`.
- Start the backend (second terminal) by running `npm run dev`.
- No need to run `/database` seperately as database is auto connect with `/backend`.
- Open the browser and visit `http://localhost:3000/` to see running application.

---

## Setup Instructions with Docker



- You need to have **Docker Desktop** installed in your local machine.
- Clone `dockerize` branch from this repository.
```sh
git clone -b dockerize https://github.com/khemrajshrestha471/Coding-Assignment-Leapfrog.git
cd Coding-Assignment-Leapfrog
```

- Add `.env` file credentials to all required paths.
- Install frontend dependencies by chnage directory to `/frontend` and run `npm install`.
- Install backend dependencies (in a new terminal) by `/backend` and run `npm install`.
- Ensure all dependencies are installed and versions matches the `package.json`.
- Open your docker desktop application.
- Go to root path where `docker-compose.yml` file located.
- Run `docker-compose up --build` for the first run to build its image locally.
- Open the browser and visit `http://localhost:3000/` to see running application.
- After first run, you can simply run `docker-compose up` to start the application.
- Make sure to down the docker image by running `docker-compose down`.

---

## Features

### Core Features

- **Notes Management**
  - Create notes
  - Edit notes
  - Delete notes
  - View list of notes
  - View a single note

- **Authentication/Authorization**
  - Signup
  - Login
  - Secure authentication mechanism with **OTP verification** via email.
  - Authorization to protect/restrict pages and APIs via **JWT tokens** and **localStorage**.

### Advanced Features

- **Search Functionality**
  - Users can search notes by title or content.

- **Sorting Options**
  - Users can sort notes by creation date, last modified date, and alphabetical order.

- **Forgot Password**
  - Users can reset the password by verifying their rest of their credentials via **OPT**.

- **Form Validation**
  - Used **Zod** for form schema validation for data consistency and security.

- **Personal Profile Page**
  - Users can view their credentials and can update their **username** and **password**.

### Engineering Excellence

- **UI/UX**
  - Clean and responsive UI.
  - Reusable frontend components (e.g., Navbars, Footer, Buttons, Dialogs, Pagination, Card, Dropdown).

- **Validation**
  - Data integrity ensured with validations in both Frontend and Backend.
  - Users can view proper errors, including validation errors or backend errors.

- **Security**
  - Secure authentication mechanism.
  - **Protected** pages/API secured by comparing tokens stored in localStorage.

- **API Design**
  - RESTful API conventions followed by proper checking it with **Postman**.
  - Proper API documentation with **Swagger**.

- **Performance**
  - Pagination and filters implemented on the server side.
  - Only **2 notes** fetched at a time.

- **Testing**
  - Unit tests implemented using **Jest** on the Login page.
  - All test cases passed.

---

## Tech Stack

- **Frontend**: Next.js (Framework of React) with shadcn for UI
- **Backend**: Node.js
- **Database**: PostgreSQL (a relational database)

--- 

## Project Structure

- **Frontend**: Holds the UI related code
- **Backend**: Contains API endpoints and server responses
- **Database**: Manages connectivity to the PostgreSQL database

---

## Dockerization

The application is dockerized into two containers:

1. **Frontend Container**
2. **Backend and Database Container**

The `docker-compose.yml` file outlines the setup for docker containerization.

---

## Deployment

The application is deployed to Azure using Docker images pushed to Docker Hub. The deployment process is managed through the `dockerize-deployment` branch.

---

## Environment Variables

Secure credentials and configurations are managed through a `.env` file, which includes:

- Database connection credentials
- Host URL
- Private keys

You can find the format used in `.env` in `.env.example` for reference.

---

## Branches

- **main**: Stable and head branch containing the latest version of the application.
- **dev**: Development branch for ongoing code changes
- **dockerize**: Branch for containerization setup
- **dockerize-deployment**: Branch for deploying the application to Azure

---

## API Documentation

API documentation is available and implemented using Swagger. This provides a comprehensive guide to the API endpoints, request/response formats, and example usage. You can access the Swagger documentation [here](http://20.197.52.87:4000/api-docs/#/default).

---

## Testing

Unit tests have been implemented using **Jest**, specifically for the Login page. All test cases have passed, ensuring the reliability of the authentication system.