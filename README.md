
# CarMitra - Car Marketplace Web App

A modern car marketplace built with React, Vite, Drizzle ORM, Neon, Clerk, and Cloudinary.

## Features
- Beautiful landing page and dashboard
- Authentication with Clerk
- Add, browse, and search car listings
- Image uploads via Cloudinary
- Make offers on cars
- INR currency support

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm

### Installation
1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd car-marketplace-web-app-main
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your credentials for:
     - Neon (PostgreSQL) database
     - Clerk (authentication)
     - Cloudinary (image uploads)

4. **Run database migrations**
   ```sh
   npx drizzle-kit push
   ```

5. **Start the development server**
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5174/`

## Environment Variables
See `.env.example` for required variables:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `DATABASE_URL` (Neon)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_UPLOAD_PRESET`

## Usage
- Visit the landing page at `/`
- Click **Get Started** to sign in or sign up
- Browse cars without authentication
- Add listings and make offers after signing in

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- Drizzle ORM + Neon PostgreSQL
- Clerk (auth)
- Cloudinary (images)

## Troubleshooting
- Make sure your environment variables are correct
- Ensure Neon, Clerk, and Cloudinary accounts are active
- Run migrations if you change the schema


