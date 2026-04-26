# 📚 Library Management System - MERN Stack

A full-stack web application to digitally manage library operations including book management, user tracking, issue/return system, and secure JWT-based admin authentication.

---

## 📌 Overview

Code Cartel's Library Management System replaces outdated manual registers and paper-based systems with an automated, centralized, and scalable solution. It improves efficiency, transparency, and accountability in library management — making it easier for admins to track books, manage users, and monitor borrowing history in real time.

---

## ✨ Core Features

- 📖 Book Management – Add, edit, delete, and search books by title or author
- 👤 User Management – Maintain a digital database of library members
- 📋 Issue & Return System – Issue books with auto due dates and return with one click
- ⏰ Overdue Detection – Visual highlighting of overdue books
- 📊 History & Analytics – Full transaction history with stats dashboard
- 🔐 Admin Authentication – Secure login system using JWT tokens
- 🚫 Availability Control – Prevent issuing when book quantity is zero

---

## 🧱 System Architecture

Client (React.js) → REST API (Express.js) → Database (MongoDB Atlas)
↑
JWT Middleware

---

## 🛠 Tech Stack

Layer — Technology

Frontend — React.js, Axios, CSS Variables
Backend — Node.js, Express.js
Database — MongoDB Atlas, Mongoose
Auth — JWT (jsonwebtoken), bcryptjs
Dev Tools — nodemon, dotenv

---

## 📂 Project Structure

```
📦 library-mgmt
 ┣ 📂 server
 ┃ ┣ 📂 models
 ┃ ┃ ┣ 📄 Book.js
 ┃ ┃ ┣ 📄 User.js
 ┃ ┃ ┗ 📄 Issue.js
 ┃ ┣ 📂 routes
 ┃ ┃ ┣ 📄 books.js
 ┃ ┃ ┣ 📄 users.js
 ┃ ┃ ┣ 📄 issues.js
 ┃ ┃ ┗ 📄 auth.js
 ┃ ┣ 📂 middleware
 ┃ ┃ ┗ 📄 auth.js
 ┃ ┣ 📄 index.js
 ┃ ┣ 📄 .env.example
 ┃ ┗ 📄 package.json
 ┣ 📂 client
 ┃ ┣ 📂 public
 ┃ ┗ 📂 src
 ┃   ┣ 📂 api
 ┃   ┃ ┗ 📄 axios.js
 ┃   ┣ 📂 components
 ┃   ┃ ┣ 📄 Navbar.jsx
 ┃   ┃ ┗ 📄 Alert.jsx
 ┃   ┣ 📂 pages
 ┃   ┃ ┣ 📄 BooksPage.jsx
 ┃   ┃ ┣ 📄 UsersPage.jsx
 ┃   ┃ ┣ 📄 IssuesPage.jsx
 ┃   ┃ ┣ 📄 HistoryPage.jsx
 ┃   ┃ ┗ 📄 LoginPage.jsx
 ┃   ┣ 📄 App.jsx
 ┃   ┗ 📄 index.js
 ┗ 📄 README.md
```

---

## ⚙️ Setup Instructions

### 🔁 1. Clone Repository

```bash
git clone https://github.com/your-repo-link-here.git
cd library-mgmt
```

---

### ☁️ 2. Setup MongoDB Atlas

Create a free account at https://www.mongodb.com/cloud/atlas
Create a free cluster (M0)
Go to Database Access and create a database user
Go to Network Access and allow access from anywhere (0.0.0.0/0)
Click Connect then Drivers and copy your connection string

---

### 📦 3. Install Dependencies

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
```

---

### 🔐 4. Environment Variables

Create a .env file inside the server/ directory and add the following:

```
PORT=3001
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
ADMIN_PASSWORD=your_admin_password_here
```

Refer to .env.example for the required variable names.
Never commit your actual .env file to GitHub!

---

### ▶️ 5. Run the Application

Start the backend — open a terminal and run:

```bash
cd server
npm start
```

You should see:

```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3001
```

Start the frontend — open a second terminal and run:

```bash
cd client
npm start
```

The app will open automatically at http://localhost:3000

---

## 🔑 Admin Login

To access admin features such as adding or editing books, managing users, and issuing or returning books:

Click Admin Login in the top navigation bar
Enter the admin password set in your .env file

---

## 🌐 API Endpoints Reference

### 📚 Books

GET /api/books — Get all books — No Auth Required
GET /api/books?search=xyz — Search by title or author — No Auth Required
POST /api/books — Add a book — Admin Required
PUT /api/books/:id — Update a book — Admin Required
DELETE /api/books/:id — Delete a book — Admin Required

### 👤 Users

GET /api/users — Get all users — No Auth Required
POST /api/users — Add a user — Admin Required
DELETE /api/users/:id — Delete a user — Admin Required

### 📋 Issues

GET /api/issues — Get active issues — No Auth Required
GET /api/issues/history — Full history — No Auth Required
POST /api/issues — Issue a book — Admin Required
PUT /api/issues/:id/return — Return a book — Admin Required

### 🔐 Auth

POST /api/auth/login — Admin login and returns JWT token

---

## 🔑 Key Modules

Code Cartel's Library Management System is built with a modular architecture to handle every aspect of library administration.

📚 Book Management
A complete system for adding, editing, deleting, and searching books. Admins can manage book inventory with quantity tracking and availability status.

👤 User Management
A digital database for maintaining library member profiles. Admins can add and remove users and track their borrowing activity.

📋 Issue & Return System
A streamlined workflow for issuing books to users with automatic 14-day due dates and one-click return processing.

⏰ Overdue Tracking
Visual indicators highlight overdue books, making it easy for admins to follow up on unreturned items.

📊 History & Analytics
A full transaction history dashboard with statistics showing total issues, returns, and overdue counts at a glance.

---

## 👥 Team Members & Contributions

Dhyey Patel — Full Stack Lead
Responsible for server setup, MongoDB Atlas integration, and JWT Authentication.

Dhyan Chawda — Frontend Developer
Responsible for building React pages, Responsive Design, Axios API Setup, components, page routing, and State Management.

Dharm Patel — Backend Developer + DevOps + Documentation
Responsible for REST API routes, Mongoose Models, CRUD Operations, GitHub setup, README, .env.example file, and Demo Video.

---

## 📈 Future Enhancements

Code Cartel is constantly looking to improve this system. Here are the features currently in our roadmap.

🔔 Email Notifications — Automated alerts for overdue books and return reminders
📱 Mobile App Version — A dedicated React Native application for students and admins
📊 Advanced Analytics — Visual charts for borrowing trends and popular books
🤖 AI Book Recommendations — Suggest books to users based on borrowing history
🔍 Barcode Scanner — Scan book barcodes for faster issue and return processing

---

## 👨‍💻 Developed By

Code Cartel — Advanced Web Technologies Course Project
