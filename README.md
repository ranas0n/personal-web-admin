# Personal Web Admin

## Overview

Hey there! Welcome to **Personal Web Admin**, a web app built on the PERN stack (PostgreSQL, Express.js, React, Node.js). This app provides an interface for managing all your personal web data and content. It lets you handle your data with ease.

## Features

- User authentication and authorization (coming soon!)
- CRUD operations for managing your web content
- UI built with React
- RESTful API with Express and Node.js
- PostgreSQL for all your database needs

## Technologies Used

- **PostgreSQL**: Relational database for storing user data and web content.
- **Express.js**: The web framework for Node.js that helps you build RESTful APIs.
- **React**: The front-end library i'm using to create user interfaces.
- **Node.js**: The JavaScript runtime that powers the server-side logic.
- **Tailwind CSS**: CSS framework for styling

## Getting Started

### Prerequisites

Before diving in, make sure you've got these installed:

- Node.js (v14 or later)
- PostgreSQL (v12 or later) or Vercel PSQL
- Vercel Blob Storage
- Git

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/harmonicnauts/personal-web-admin.git
   cd personal-web-admin
   ```

2. **Set up the server**:

   Navigate to the backend directory and install dependencies:

   ```bash
   cd backend
   npm install
   ```

3. **Set up the client**:

   Navigate to the frontend directory and install dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up the .env file**:

   Setup your .env file

   ```bash
   DATABASE_URL="postgres://sumthin"
   ```

5. **Run the database migrations**:

   Make sure PostgreSQL is running or already hosted, then run the migrations to set up your database schema:

   ```bash
   cd backend
   npm run migrate
   ```

6. **Start the development servers**:

   Open two terminal windows and start the server and client:

   ```bash
   # In the first terminal for the server
   cd backend
   npm start

   # In the second terminal for the client
   cd frontend
   npm start
   ```

## TODO

- Fetch => React Query for caching
- Use dynamic table
- Add delete image on update page (add placeholder as well)
- Get the project-stack i/o running
