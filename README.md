# Booking Service - Airline Booking System

A microservice for managing flight bookings in an airline booking system. This service handles the creation and management of flight reservations, seat allocation, and booking status tracking.

## Features

- **Flight Booking Creation**: Create new bookings with automatic seat availability checks
- **Real-time Seat Management**: Integrates with Flight Service to update available seats
- **Cost Calculation**: Automatically calculates total booking cost based on flight price and number of seats
- **Booking Status Tracking**: Tracks booking status (UnderProcess, Booked, Cancelled)
- **Data Validation**: Validates booking data and prevents overbooking

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **HTTP Client**: Axios
- **Other Dependencies**:
  - body-parser - Request body parsing
  - dotenv - Environment variable management
  - http-status-codes - HTTP status code constants
  - morgan - HTTP request logger
  - nodemon - Development auto-reload

## Database Schema

### Booking Model
```javascript
{
  id: INTEGER (Primary Key, Auto-increment),
  flightId: INTEGER (Required),
  userId: INTEGER (Required),
  status: ENUM ['UnderProcess', 'Booked', 'Cancelled'] (Default: 'UnderProcess'),
  noOfSeats: INTEGER (Default: 1),
  totalCost: INTEGER (Default: 0),
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

## Project Structure

```
BookingService/
├── src/
│   ├── config/
│   │   ├── config.json          # Database configuration
│   │   └── serverConfig.js      # Server environment config
│   ├── controllers/
│   │   └── booking-controller.js # Request handlers
│   ├── models/
│   │   └── booking.js           # Sequelize Booking model
│   ├── repository/
│   │   └── booking-repository.js # Database operations
│   ├── routes/
│   │   ├── index.js
│   │   └── v1/
│   │       └── index.js         # API v1 routes
│   ├── services/
│   │   └── booking-service.js   # Business logic
│   ├── utils/
│   │   └── errors/              # Custom error classes
│   ├── migrations/              # Database migrations
│   └── index.js                 # Application entry point
├── package.json
└── README.md
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BookingService
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3002
   FLIGHT_SERVICE_PATH=http://localhost:3001
   DB_SYNC=true
   ```

4. **Configure database**
   
   Update `src/config/config.json` with your MySQL credentials:
   ```json
   {
     "development": {
       "username": "your_username",
       "password": "your_password",
       "database": "booking_db",
       "host": "127.0.0.1",
       "dialect": "mysql"
     }
   }
   ```

5. **Run database migrations**
   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   ```

## Usage

### Start the server

**Development mode (with auto-reload):**
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3002).

### API Endpoints

#### Create a Booking
```http
POST /api/v1/booking
```

**Request Body:**
```json
{
  "flightId": 1,
  "userId": 101,
  "noOfSeats": 2
}
```

**Success Response (200 OK):**
```json
{
  "message": "Successfully completed booking",
  "success": true,
  "err": {},
  "data": {
    "id": 1,
    "flightId": 1,
    "userId": 101,
    "noOfSeats": 2,
    "totalCost": 10000,
    "status": "Booked",
    "createdAt": "2026-01-10T10:30:00.000Z",
    "updatedAt": "2026-01-10T10:30:00.000Z"
  }
}
```

**Error Response (500):**
```json
{
  "message": "Error message",
  "success": false,
  "error": "Error explanation",
  "data": {}
}
```

## How It Works

### Booking Flow

1. **Receive booking request** with `flightId`, `userId`, and `noOfSeats`
2. **Fetch flight details** from Flight Service via HTTP request
3. **Validate seat availability** - Ensures requested seats are available
4. **Calculate total cost** - `flightPrice × noOfSeats`
5. **Create booking record** with status "UnderProcess"
6. **Update flight seats** in Flight Service
7. **Update booking status** to "Booked"
8. **Return booking confirmation**

### Error Handling

The service includes custom error classes:
- `ServiceError` - Business logic errors
- `ValidationError` - Input validation errors
- `RepositoryError` - Database operation errors

## Dependencies on Other Services

This service requires the **Flight Service** to be running and accessible at the URL specified in `FLIGHT_SERVICE_PATH`. It communicates with:

- `GET /api/v1/flights/:id` - Fetch flight details
- `PATCH /api/v1/flights/:id` - Update available seats

## Database Migrations

The service includes migrations for:
1. Creating the initial Booking table
2. Adding `noOfSeats` and `totalCost` fields
3. Renaming `filghtId` to `flightId` (typo fix)

To run migrations:
```bash
npx sequelize-cli db:migrate
```

To rollback:
```bash
npx sequelize-cli db:migrate:undo
```

## Development

- Auto-reload is enabled via nodemon
- Set `DB_SYNC=true` in `.env` to auto-sync database schema on server start

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3002` |
| `FLIGHT_SERVICE_PATH` | Flight Service base URL | `http://localhost:3001` |
| `DB_SYNC` | Auto-sync database schema | `true` or `false` |

## License

ISC

## Author

[Your Name]

---

**Part of the Airline Booking System microservices architecture**