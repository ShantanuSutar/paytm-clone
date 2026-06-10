# Paytm Clone - Wallet Platform

A full-stack payment wallet platform built with Next.js, TypeScript, and PostgreSQL. Features peer-to-peer transfers, wallet top-ups, and merchant payment acceptance.

## Features

### User App (Port 3001)
- **Wallet Management**: Add money to wallet via bank integration
- **P2P Transfers**: Send money to other users using phone numbers
- **Transaction History**: View all wallet transactions and P2P transfers
- **Balance Management**: Real-time balance tracking
- **Webhook Simulation**: Manual webhook triggering for testing

### Merchant App (Port 3000)
- **Merchant Authentication**: Google/GitHub OAuth support
- **Payment Acceptance**: Accept payments from users
- **Transaction Management**: View merchant transactions

### Bank Webhook Handler (Port 3003)
- **Webhook Processing**: Handle bank callbacks for on-ramp transactions
- **Balance Updates**: Automatic balance increment on successful payments

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Monorepo**: Turborepo
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **State Management**: Recoil
- **CI/CD**: GitHub Actions

## Project Structure

```
paytm-clone/
├── apps/
│   ├── user-app/              # User-facing wallet application
│   ├── merchant-app/          # Merchant payment application
│   └── bank_webhook_handler/  # Bank webhook processing service
├── packages/
│   ├── db/                    # Prisma schema and database client
│   ├── ui/                    # Shared UI components
│   ├── store/                 # Shared state management
│   ├── eslint-config/         # ESLint configurations
│   └── typescript-config/     # TypeScript configurations
└── .github/
    └── workflows/             # CI/CD pipelines
```

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm (v10.2.4+)

## Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd paytm-clone
npm install
```

### 2. Environment Variables

Create `.env` files in the following locations:

**packages/db/.env**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/paytm"
```

**apps/user-app/.env**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/paytm"
NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"
NEXTAUTH_URL="http://localhost:3001"
```

**apps/merchant-app/.env**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/paytm"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
cd packages/db
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

The seed script creates two test users:
- **Alice**: Phone `1111111111`, Password `alice` (Balance: ₹20,000)
- **Bob**: Phone `2222222222`, Password `bob` (Balance: ₹2,000)

### 4. Run Development Servers

```bash
npm run dev
```

This starts all applications:
- User App: http://localhost:3001
- Merchant App: http://localhost:3000
- Bank Webhook Handler: http://localhost:3003

## Usage

### Adding Money to Wallet

1. Log in to the user app
2. Navigate to "Add Money" page
3. Enter amount and select bank
4. Click "Add Money" - a modal appears with transaction details:
   - **Token**: Unique transaction identifier
   - **User ID**: Your user ID
   - **Amount**: Amount in paise
5. Copy these details
6. Click "Continue to Bank" (redirects to bank URL)
7. Navigate to `/webhook-simulator`
8. Paste the copied details and trigger the webhook
9. Balance updates automatically

### P2P Transfers

1. Navigate to "Send" page
2. Enter recipient's phone number and amount
3. Click "Send"
4. Transaction completes instantly if recipient exists
5. View transfers in "P2P" page

### Testing the Application

Use the test users created by the seed script:

1. Log in as Alice (1111111111/alice)
2. Send money to Bob (2222222222)
3. Log out and log in as Bob to verify
4. Check transaction histories

## CI/CD Pipeline

The project includes automated CI/CD workflows:

### Continuous Integration
- Runs on push/PR to `main` and `develop` branches
- Tests: Node.js 18.x and 20.x
- Checks: Linting, TypeScript compilation, build
- Includes PostgreSQL service for database testing

### Deployment
- **User App & Merchant App**: Deployed to Vercel
- **Bank Webhook Handler**: Deployed to Render
- Triggers on push to `main` branch

### Required GitHub Secrets

- `VERCEL_TOKEN` - Vercel deployment token
- `RENDER_DEPLOY_HOOK_URL` - Render deployment hook URL
- `DATABASE_URL` - Production database connection string

## Build

```bash
npm run build
```

## Testing Locally with Docker

```bash
docker-compose -f docker-compose.ci.yml up --build
```

## Scripts

- `npm run dev` - Start all development servers
- `npm run build` - Build all packages
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Key Features Implementation

### Wallet Top-up Flow
1. User initiates "Add Money" → Creates `OnRampTransaction` with status "Processing"
2. Modal displays transaction token for manual webhook triggering
3. User visits bank URL (simulated)
4. User manually triggers webhook via `/webhook-simulator`
5. Webhook updates transaction status to "Success"
6. User balance is incremented via atomic database transaction

### Balance Management
- Uses `Balance` model with `amount` and `locked` fields
- New users get Balance record created automatically via `upsert` on first transaction
- Atomic transactions ensure data consistency

### P2P Transfers
- Direct database transfer between users
- Validates recipient exists
- Updates both sender and receiver balances atomically
- Records transfer history for both parties

## Database Schema

- **User**: Phone, email, password, balance, transactions
- **Merchant**: Email, name, auth type (Google/GitHub)
- **Balance**: Amount, locked amount
- **OnRampTransaction**: Status, token, provider, amount
- **P2PTransfer**: Amount, timestamp, from/to users

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT
