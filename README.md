# Admin Dashboard

A modern admin dashboard built with Next.js, Supabase, Tailwind CSS, and Vercel. This project provides a complete admin interface for managing products with a PostgreSQL database.

## Features

- 🏗️ **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS
- 🗄️ **Database**: Supabase with PostgreSQL
- 🎨 **UI Components**: shadcn/ui with Radix UI
- 🚀 **Deployment**: Vercel with GitHub integration
- 📊 **Dashboard**: Product management with real-time data
- 🔐 **Authentication**: Ready for NextAuth.js integration

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **UI Components**: shadcn/ui, Radix UI
- **Deployment**: Vercel
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Supabase account
- GitHub account
- Vercel account

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Environment Setup

Copy the environment template and fill in your values:

```bash
cp .env.example .env.local
```

Fill in the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth.js Configuration (optional)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Database URL (if using direct connection)
DATABASE_URL=your_database_url_here
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and keys
3. Go to SQL Editor and run the migration files:

```sql
-- Run the contents of supabase/migrations/20250828164245_create_products_table.sql
-- Then run the contents of supabase/migrations/20250828164251_seed_products.sql
```

Or use the Supabase CLI:

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Link your project
supabase link --project-ref your-project-id

# Apply migrations
supabase db push
```

### 4. Seed the Database

Visit `http://localhost:3000/api/seed` to populate your database with sample data.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── products/          # CRUD API for products
│   │   └── seed/             # Database seeding endpoint
│   ├── dashboard/            # Dashboard pages
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main dashboard page
├── components/
│   ├── ui/                   # Reusable UI components
│   └── dashboard/            # Dashboard-specific components
├── lib/
│   ├── supabase.ts           # Supabase client configuration
│   └── utils.ts              # Utility functions
└── types/
    └── database.ts           # TypeScript database types
```

## Database Schema

### Products Table

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  name TEXT NOT NULL,
  status status NOT NULL DEFAULT 'active',
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  available_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Status enum: 'active', 'inactive', 'archived'
```

## API Endpoints

- `GET /api/products` - List all products
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get a specific product
- `PUT /api/products/[id]` - Update a product
- `DELETE /api/products/[id]` - Delete a product
- `GET /api/seed` - Seed the database with sample data

## Deployment

### 1. Push to GitHub

Create a new repository on GitHub and push your code:

```bash
# The repository is already initialized with Git
# Create a new repository on GitHub, then:

git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables in Vercel dashboard
5. Deploy!

### 3. Connect Supabase to Vercel

In your Vercel project settings, add these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding New Components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add [component-name]
```

### Database Migrations

To create new migrations:

```bash
supabase migration new migration_name
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on GitHub or contact the maintainers.
