# TripRide - Full Stack Taxi, Car, Tempo Traveller & Bus Booking Platform

A working MVP based on the supplied TripRide UI reference. It contains:

- Next.js + React + Tailwind CSS customer portal
- Node.js + Express REST API
- SQLite persistence with a zero-config local database
- JWT authentication with roles: CUSTOMER, OPERATOR, DRIVER, ADMIN
- Customer search and booking flow
- Operator trip request acceptance/rejection
- Driver trip status updates
- Admin dashboard for bookings, leads, vehicles, operators and drivers
- Vehicle CRUD-ready API and seed data
- Quote/booking workflow
- Responsive desktop/mobile UI

## Requirements

- Node.js 20+
- npm 10+

## Run

```bash
npm install
npm run install:all
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:4000
Health: http://localhost:4000/api/health

Demo accounts:

- Admin: admin@tripride.in / Admin@123
- Customer: customer@tripride.in / Customer@123
- Operator: operator@tripride.in / Operator@123
- Driver: driver@tripride.in / Driver@123

The database is created automatically at `backend/data/tripride.sqlite` and seeded on first start.

## Production next steps

Replace SQLite with PostgreSQL, move JWT secrets to a secret manager, integrate OTP provider, payment gateway, Google Maps/Mapbox, WhatsApp Business API, push notifications and real driver GPS tracking. Add legal/KYC verification workflows before accepting real customers.
