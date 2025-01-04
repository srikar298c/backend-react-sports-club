import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import httpStatus from 'http-status';
import { successHandler, errorHandler } from './config/morgan'; 
import compression from 'compression';
import router from './routes'; // Import the router
import ApiError from './utils/ApiError'; // Custom API Error class
import globalErrorHandler from './middlewares/globalErrorHandler';
import {config} from './config/config'
import passport from 'passport';
import { setupJwtStrategy } from './config/passport'
import path from 'path';
import { setupGoogleStrategy } from './config/passportGoogle';
import session from 'express-session';




const app: Application = express();


app.use(express.static(path.join(__dirname, '../../frontend/public')));
// Middleware
if (config.env !== 'test') {
   app.use(successHandler);
  app.use(errorHandler);
} // Logs HTTP requests
app.use(helmet()); // Secure HTTP headers
const corsOptions = {
  origin: ['http://localhost:3000'], // Replace with the frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies to be sent
};

// Apply CORS middleware with options
app.use(cors(corsOptions));
app.options('*', cors());
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(compression()); // Compress response bodies

// Routes
app.use('/api', router);
app.use(
  session({
    secret: config.session.secret, // Use a secure key from the config
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.env === 'production', // Use secure cookies in production
      httpOnly: true, // Prevent client-side access
    },
  })
);

// jwt authentication
app.use(passport.initialize());
app.use(passport.session());
// Setup the JWT strategy
setupJwtStrategy(passport);
setupGoogleStrategy(passport);
// Health check
app.get('/', (req: Request, res: Response) => {
  res.status(httpStatus.OK).send({ message: 'API is running' });
});

// Handle 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError('Not Found', httpStatus.NOT_FOUND));
});

// Error handling middleware
app.use(globalErrorHandler);

export default app;
