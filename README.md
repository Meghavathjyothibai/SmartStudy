# 📚 Smart Study Scheduler

A comprehensive full-stack study planning application that helps students organize their study time effectively using smart scheduling and real-time progress tracking.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-24.x-2496ED?logo=docker)

---

## 🌟 Features

### 🔐 Authentication

* JWT-based secure login/signup
* Password hashing with bcrypt
* Profile management

### 📝 Task Management

* Create, update, delete tasks
* Priority levels (Low, Medium, High, Urgent)
* Due dates & time slots
* Subtasks & tags
* Progress tracking

### 📅 Calendar View

* Monthly calendar
* Task visualization by date
* Color-coded priorities
* Daily task breakdown

### 📊 Analytics Dashboard

* Study time tracking
* Task completion stats
* Weekly productivity charts
* Streak & achievements

### 🎨 UI/UX

* Responsive design
* Dark/Light mode
* Smooth animations
* Clean dashboard layout

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

### Tools

* Docker
* Git & GitHub

---

## 📋 Prerequisites

* Node.js (v18+)
* MongoDB (Local / Docker / Atlas)
* Git
* npm

---

## 🚀 Installation & Setup

### 🔹 Clone Repo

```bash
git clone https://github.com/Meghavathjyothibai/SmartStudy.git
cd SmartStudy
```

---

### 🔹 Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 🔹 Docker Setup (Optional)

```bash
cd docker
docker-compose up -d
```

---

## 🌐 Environment Variables

Create `.env` inside backend:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smart-study-scheduler
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

---

## 📁 Project Structure

```
SmartStudy/
├── backend/
├── frontend/
├── docker/
└── README.md
```

---

## 🔌 API Overview

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

### Tasks

* GET `/api/tasks`
* POST `/api/tasks`
* PUT `/api/tasks/:id`
* DELETE `/api/tasks/:id`

### Analytics

* GET `/api/analytics/overview`

---

## 🐳 Docker Commands

```bash
docker-compose up -d
docker-compose down
docker-compose logs -f
```

---

## 🎯 Usage

1. Signup/Login
2. Create tasks
3. Manage schedule
4. Track progress
5. View analytics

---

## 🤝 Contributing

```bash
git checkout -b feature/new-feature
git commit -m "Added new feature"
git push origin feature/new-feature
```

---

## 📬 Github Link

GitHub:  https://github.com/Meghavathjyothibai/SmartStudy

---

## 🎓 Project Highlights

* MERN Stack Project
* JWT Authentication
* REST API Design
* Docker Integration
* Responsive UI

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---

Made with ❤️ by JyothiBai Meghavath
