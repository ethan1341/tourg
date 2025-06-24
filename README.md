# FrontNine Server

A Node.js backend server for the FrontNine golf application that helps track and analyze golf shots, club presets, and range sessions.

## Technology Stack

- **Node.js & Express**: Backend server framework
- **TypeScript**: For type-safe code
- **MongoDB & Mongoose**: Database and ODM
- **Zod**: Runtime schema validation
- **Express Session**: Session management
- **Passport.js**: OAuth authentication middleware


1. **Validation**: All incoming requests are validated using Zod schemas
2. **Type Safety**: TypeScript and Zod provide end-to-end type safety
3. **Authentication**: Secure session management with Express Session
4. **Error Handling**: Structured error responses for validation failures and Response Codes
5. **Code Organization**: Clear separation of concerns between models, controllers, and routes 


## Architecture Overview

### Schema Validation Pattern

The application uses a dual-schema approach combining Zod and Mongoose:

1. **Zod Schemas**: Runtime validation for API requests
   - Located in `model/*.ts` files (e.g., `clubPresetSchema.ts`, `rangeSessionSchema.ts`)
   - Validates incoming request payloads
   - Provides TypeScript types through inference
   - Example:
   ```typescript
   const BaseClubPresetZ = z.object({
       name: z.string(),
       clubs: z.array(ClubZ),
       totalSwings: z.number(),
       clubCount: z.number()
   });
   ```

2. **Mongoose Schemas**: Database models
   - Defines the structure for MongoDB documents
   - Handles data persistence and relationships
   - Example:
   ```typescript
   const ClubPresetSchemaType = {
       name: String,
       clubs: Array<Club>,
       totalSwings: Number,
       clubCount: Number
   };
   ```

## Authentication System

### Session Management with Express Session

The application uses Express Session for authentication and session management:

```typescript
import session from 'express-session';
import MongoStore from 'connect-mongo';

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}));
```

Session Flow:
1. User logs in through Google OAuth
2. Server creates a session and stores it in MongoDB
3. Session cookie is sent to the client
4. Client includes cookie in subsequent requests
5. Server validates session on protected routes

### Google OAuth Integration

The application uses Passport.js for Google OAuth authentication:

```typescript
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Find or create user in database
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName
            });
        }
        
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Session serialization
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
```


## Main Features

1. **Club Presets**:
   - Create, read, update, and delete golf club presets
   - Track total swings and club counts
   - Validated through `BaseClubPresetZ` and `ClubPresetZ` schemas

2. **Range Sessions**:
   - Record and analyze golf practice sessions
   - Track various shot statistics:
     - Good Shot
     - Straight Pull
     - Hook
     - Pull Hook
     - Fat
     - Top
     - Push Slice
     - Slice
     - Straight Push

3. **User Authentication**:
   - Google OAuth integration
   - Session-based authentication
   - Protected routes for authenticated users

## API Routes

### Authentication
- `GET /auth/google`: Initiate Google OAuth flow
- `GET /auth/google/callback`: Google OAuth callback
- `POST /auth/logout`: User logout

### Club Presets (Protected Routes)
- `GET /club-presets/`: Get user's club presets
- `POST /club-presets/add`: Add new club preset
- `POST /club-presets/remove`: Remove existing preset
- `POST /club-presets/update`: Update existing preset

### Range Sessions (Protected Routes)
- `GET /range-sessions/`: Get user's range sessions
- `POST /range-sessions/add`: Add new range session
- `POST /range-sessions/remove`: Remove range session

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```env
   SESSION_SECRET=your-session-secret
   MONGODB_URI=your-mongodb-uri
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. Configure OAuth:
   - Create a Google Cloud Project
   - Configure OAuth consent screen
   - Add authorized redirect URI:
     - `BASEURL/auth/google/callback`

4. Run development server:
   ```bash
   npm run dev
   ```



## Security

- Session-based authentication
- Request validation using Zod
- Protected routes using middleware
- Google OAuth integration
- Environment variables for sensitive data
- Secure session configuration

## Error and Response Handling

### Response Structure

All API responses follow a consistent structure:

```typescript
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}
```

### HTTP Status Codes

The application uses standard HTTP status codes:

- `200 OK`: Successful request
- `201 Created`: Resource successfully created
- `400 Bad Request`: Invalid input/validation error
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server-side error


### Error Handling Middleware

```typescript
// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // Log error for debugging
    console.error(err);

    // Default error response
    const error = {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
    };

    // Handle specific error types
    if (err instanceof ZodError) {
        return res.status(422).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: err.errors
            }
        });
    }

    // Handle other known errors
    if (err.type === 'NotFoundError') {
        return res.status(404).json({
            success: false,
            error: {
                code: 'NOT_FOUND',
                message: err.message
            }
        });
    }

    // Return sanitized error response
    res.status(500).json({
        success: false,
        error
    });
});
```

### Successful Response Examples

1. **Single Resource**:
```typescript
{
    success: true,
    data: {
        id: '123',
        name: 'Driver Preset',
        clubs: [],
        totalSwings: 0
    }
}


### Response Helper Functions

```typescript
// Utility functions for consistent response formatting
export const sendSuccess = <T>(res: Response, data: T, status = 200) => {
    res.status(status).json({
        success: true,
        data
    });
};

export const sendError = (
    res: Response,
    code: string,
    message: string,
    status = 400,
    details?: any
) => {
    res.status(status).json({
        success: false,
        error: {
            code,
            message,
            ...(details && { details })
        }
    });
};
```

``` Example of response and multilevel error handling with Enums
export const validate = (schema: Schema)=>{
    return (req: express.Request, res: express.Response, next: NextFunction) => {
       if(req.body && Object.keys(req.body).length > 0){
           try {
               schema.parse(req.body);
               next(); // SUCCESS - continue to route handler
           }catch(error){
               res.status(ResponseTypeToHttpStatus[ResponseType.VALIDATION_ERROR]).json(generateResponseObject(ResponseType.VALIDATION_ERROR))
           }
       }else{
           res.status(ResponseTypeToHttpStatus[ResponseType.MISSING_BODY]).json(generateResponseObject(ResponseType.MISSING_BODY))
       }
    };
}
```

