# **Full Stack Chat App**

## **Introduction**

This project is a full-stack real-time chat application built with Node.js, Express.js, and MongoDB on the backend, and React with Tailwind CSS on the frontend. It supports one-on-one messaging and real-time updates powered by Socket.IO. Users can search for others, start new chats, send text messages and images, and manage their profiles, including updating profile information. The application follows best practices for scalability, maintainability, and security across both frontend and backend.

## **Technologies Used**

### Backend

- **Node.js** – JavaScript runtime for building scalable server-side applications
- **Express.js** – Minimalist web framework for building RESTful APIs
- **MongoDB** – NoSQL database for storing users, chats, and messages
- **Mongoose** – ODM for MongoDB providing schema validation and data modeling
- **Socket.IO** – Enables real-time, bidirectional communication between client and server
- **Cloudinary** – Cloud-based service for storing and managing images

### Frontend

- **React** – Library for building interactive user interfaces
- **Vite** – Fast build tool and development server
- **Tailwind CSS** – Utility-first CSS framework for responsive styling
- **React Router** – Handles client-side routing and navigation
- **Zustand** – State management library to share data across components
- **Axios** – Handles HTTP requests to the backend
- **Socket.IO Client** – Client-side library for real-time communication with the backend

## **Features**

### Real-Time Chat

- One-on-one messaging with support for text and image messages
- Emits a `newMessage` event when the recipient is online
- Clients listening for `newMessage` to update the chat UI immediately
- Online users list updates in real time when users connect or disconnect

### File Uploads & Processing

- Cloudinary integration for secure image storage
- Multer middleware for handling image uploads
- Sharp library for resizing and compressing uploaded images

### Authentication & Security

- Secure login and authentication using JWT
- Token validation with expiration handling
- Protect middleware to restrict access to authenticated routes
- Passwords hashed with bcrypt
- Rate limiting to protect against brute-force and DoS attacks
- Request body size limit to prevent large payload attacks
- **Frontend** – Protected routes (/ and /profile) only accessible to logged-in users
- **Frontend** – Redirects authenticated users away from /signup and /login

### User Search & Chat Management

- Search for users by name and start new chats directly from search results
- Chat list updates automatically when new chats are created

### Profile Management

- Update profile name, email, and profile image

## **Environment Variables**

This project requires two separate environment configuration files:</br>
`.env` for the backend (placed in the backend/ directory).</br>
`.env` for the frontend (placed in the frontend/ directory).

### Backend `.env` Example

```
NODE_ENV=production
PORT=3000

# MongoDB Configuration
DATABASE=your_mongo_atlas_connection_string
DATABASE_PASSWORD=your_database_password

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

# JWT Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# API Version
API_VERSION=1.0
```

### Frontend `.env` Example

```
# API Endpoint for the backend server
VITE_BACKEND_URL=http://localhost:3000/api
```

## **Deployment Notes**

### Backend Deployment

- Run `npm install` to install all necessary dependencies before starting the server
- Set `NODE_ENV=production` to enable secure cookies
- Keep `.env` private and never commit to version control
- Configure CORS origin inside `src/app.js` to match your frontend domain
- Configure CORS origin inside `src/utils/socket.js` to match your frontend domain
- Run the project in production mode using: `npm run start:prod`

### Frontend Deployment

- Update socket URL in `src/stores/authStore.js` to match your backend domain
- Run the project using: `npm run dev`
