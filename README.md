# Slooze - Restaurant Management System

A full-stack restaurant management system built with Next.js, TypeScript, and Node.js.

## Project Structure

This project consists of two main parts:

- Frontend: Next.js application
- Backend: Node.js/Express API

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB (local or Atlas)

## Setup Instructions

### Frontend Setup

1. Clone the frontend repository:

```bash
git clone https://github.com/impankaj1/slooze-frontend.git
cd slooze-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Add the following to your `.env` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### Backend Setup

1. Clone the backend repository:

```bash
git clone https://github.com/impankaj1/slooze-backend.git
cd slooze-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Add the following to your `.env` file:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
```

## Running the Application

1. Start the backend server:

```bash
cd slooze-backend
npm run dev
```

2. In a new terminal, start the frontend development server:

```bash
cd slooze-frontend
npm run dev
```

3. Open your browser and navigate to:

```
http://localhost:3000
```

## Features

- User Authentication (Login/Signup)
- Restaurant Management
- Menu Item Management
- Order Management
- Cart Functionality
- Payment Integration
- Role-based Access Control

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Axios
- React Query

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- JWT Authentication
- Mongoose

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the my License.
