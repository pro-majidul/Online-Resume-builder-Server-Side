

## 📁 Project Structure

```
your-project/
│── node_modules/      # Project dependencies
│── config/            # Database & environment configuration
│   ├── db.js          # Database connection setup
│── controllers/       # Route handler functions
│   ├── userController.js  # User-related logic
│── models/            # Mongoose schemas & models
│   ├── User.js        # User schema definition
│── routes/            # Express routes
│   ├── userRoutes.js  # User-related routes
│── middlewares/       # Custom middlewares
│   ├── authMiddleware.js  # Authentication middleware
│── .env               # Environment variables
│── server.js          # Main entry point for the application
│── package.json       # Project metadata & dependencies
│── README.md          # Project documentation
```





## API Key 

* POST ---http://localhost:5000/api/auth/signin
* POST http://localhost:5000/api/auth/signup
* POST http://localhost:5000/api/auth/google-login
* GET  http://localhost:5000/api/auth/users
* GET http://localhost:5000/api/auth/users/:id
* PATCH http://localhost:5000/api/auth/users/:id
* DELETE http://localhost:5000/api/auth/users/:id
