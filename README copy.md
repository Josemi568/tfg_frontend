# React Login App

This is a simple React application that implements a login feature using username authentication. The application uses JWT (JSON Web Token) for managing user sessions and stores the token in local storage.

## Project Structure

```
react-login-app
├── public
│   └── index.html          # Main HTML file
├── src
│   ├── main.tsx           # Entry point of the React application
│   ├── App.tsx            # Main application component with routing
│   ├── index.css          # Global CSS styles
│   ├── pages
│   │   ├── Login.tsx      # Login component for user authentication
│   │   └── Dashboard.tsx   # Dashboard component for authenticated users
│   ├── components
│   │   └── PrivateRoute.tsx # Component for protecting routes
│   ├── services
│   │   ├── httpClient.ts   # HTTP client setup for API requests
│   │   └── auth.ts         # Authentication functions
│   ├── hooks
│   │   └── useAuth.ts      # Custom hook for authentication state
│   ├── utils
│   │   └── storage.ts      # Utility functions for local storage
│   └── types
│       └── index.ts        # TypeScript types and interfaces
├── package.json            # npm configuration file
├── tsconfig.json           # TypeScript configuration file
├── vite.config.ts          # Vite configuration file
└── README.md               # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd react-login-app
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Usage

- Navigate to the `/login` route to access the login page.
- Enter your username to log in. Upon successful authentication, you will be redirected to the dashboard.
- The dashboard displays user-specific information and is protected by the `PrivateRoute` component, which checks for the presence of a JWT in local storage.

## Technologies Used

- React
- TypeScript
- Vite
- Axios (for HTTP requests)

## License

This project is licensed under the MIT License.