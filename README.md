# Metabase Dashboard Embedding Web App  

## Table of Contents  
1. [Introduction](#introduction)  
2. [Features](#features)  
3. [Project Structure](#project-structure)  
4. [Setup Instructions](#setup-instructions)  
5. [Usage](#usage)  
6. [Screenshots](#screenshots)  
7. [Technologies Used](#technologies-used)  
8. [Contributing](#contributing)  
9. [License](#license)  

---

## Introduction  
The **Metabase Dashboard Embedding Web App** is a Node.js-based application that integrates Metabase dashboards into a web interface. It provides secure access to dynamic data visualizations using session-based authentication and JSON Web Tokens (JWT). The app supports role-based access control, ensuring users see only relevant dashboards.  

---

## Features  
- **User Authentication**: Secure login system using bcrypt for password hashing and `express-session` for session management.  
- **Role-Based Access Control**:  
  - **Students**: Access a public dashboard with data details hidden.  
  - **Admins**: Access all dashboards and manage users.  
- **Metabase Integration**: Dashboards are embedded using signed JWT tokens for secure and seamless display.  
- **Dynamic Content Rendering**: Responsive design using EJS templates for dynamic frontend rendering.  
- **Secure Configuration**: Uses `.env` file to store sensitive data like database credentials and Metabase secrets.  

---

## Project Structure  



- ├── index.js # Main server file
- ├── dbconfig.js # Database connection configuration
- ├── views/ # EJS templates for frontend
- │ ├── login.ejs
- │ ├── dashboard.ejs
- │ └── admin.ejs
- ├── public/ # Static assets (CSS, images, etc.)
- ├── createUser.js # Script to create new users with hashed passwords
- ├── .env # Environment variables
- ├── package.json # Project dependencies
- └── README.md # Project documentation

  
---

## Setup Instructions  

1. **Clone the repository**:  
   ```bash  
   git clone https://github.com/your-username/metabase-dashboard-webapp.git  
   cd metabase-dashboard-webapp
   ``` 

2. **Install Dependencies**: 
   ```bash
   npm install
   ```

3. **Set up the environment variables**:
  ```bash  
  DB_HOST=your-database-host  
  DB_USER=your-database-user  
  DB_PASSWORD=your-database-password  
  DB_NAME=your-database-name  
  MB_SITE_URL=your-metabase-site-url  
  MB_EMBEDDING_SECRET_KEY=your-metabase-secret-key  
  ```
4. **Start the Server**:
  ```bash
  npm start
  ```
5. **Access the app**:
  ```bash
  Visit http://localhost:3000 in your web browser.
  ```

## Usage

Login: Use your username and password to log in.
Dashboard Access:
Students can view public dashboards.
Admins can manage users and access all dashboards.

##Screenshots





