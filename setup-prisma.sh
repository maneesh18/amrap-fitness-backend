#!/bin/bash

echo "🔧 Setting up Prisma with your database connection..."

# Update .env file with Prisma connection string
if [ -f .env ]; then
    echo "Updating .env file..."
    
    # Remove old DATABASE_URL if exists
    sed -i.bak '/^DATABASE_URL=/d' .env 2>/dev/null || true
    sed -i.bak '/^POSTGRES_URL=/d' .env 2>/dev/null || true
    sed -i.bak '/^PRISMA_DATABASE_URL=/d' .env 2>/dev/null || true
    
    # Add Prisma connection strings
    cat >> .env << 'EOF'

# Prisma Database Connection
DATABASE_URL="postgres://c19d3860383ce2a6f834129b808f90fbca789c09e104c5076ba4230fc1a3ddbe:sk_KIgZbawByofgy0N_Asxsa@db.prisma.io:5432/postgres?sslmode=require"
POSTGRES_URL="postgres://c19d3860383ce2a6f834129b808f90fbca789c09e104c5076ba4230fc1a3ddbe:sk_KIgZbawByofgy0N_Asxsa@db.prisma.io:5432/postgres?sslmode=require"
PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19LSWdaYmF3QnlvZmd5ME5fQXN4c2EiLCJhcGlfa2V5IjoiMDFLQk45TUtEWjA3ODJXM0FBQzExWlhUUE0iLCJ0ZW5hbnRfaWQiOiJjMTlkMzg2MDM4M2NlMmE2ZjgzNDEyOWI4MDhmOTBmYmNhNzg5YzA5ZTEwNGM1MDc2YmE0MjMwZmMxYTNkZGJlIiwiaW50ZXJuYWxfc2VjcmV0IjoiODQ0MzJmZDQtNmRmZS00OWExLTk0NmItZjBhZDY5YTRiNzU4In0.MOA4WSIWNrm8ni2piQ6A75uBfdRODlBG9X-Lp7OUr6U"
EOF
    
    echo "✅ .env file updated"
else
    echo "Creating .env file..."
    cat > .env << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=fitness_platform
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000

# Prisma Database Connection
DATABASE_URL="postgres://c19d3860383ce2a6f834129b808f90fbca789c09e104c5076ba4230fc1a3ddbe:sk_KIgZbawByofgy0N_Asxsa@db.prisma.io:5432/postgres?sslmode=require"
POSTGRES_URL="postgres://c19d3860383ce2a6f834129b808f90fbca789c09e104c5076ba4230fc1a3ddbe:sk_KIgZbawByofgy0N_Asxsa@db.prisma.io:5432/postgres?sslmode=require"
PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19LSWdaYmF3QnlvZmd5ME5fQXN4c2EiLCJhcGlfa2V5IjoiMDFLQk45TUtEWjA3ODJXM0FBQzExWlhUUE0iLCJ0ZW5hbnRfaWQiOiJjMTlkMzg2MDM4M2NlMmE2ZjgzNDEyOWI4MDhmOTBmYmNhNzg5YzA5ZTEwNGM1MDc2YmE0MjMwZmMxYTNkZGJlIiwiaW50ZXJuYWxfc2VjcmV0IjoiODQ0MzJmZDQtNmRmZS00OWExLTk0NmItZjBhZDY5YTRiNzU4In0.MOA4WSIWNrm8ni2piQ6A75uBfdRODlBG9X-Lp7OUr6U"
EOF
    echo "✅ .env file created"
fi

echo ""
echo "📦 Generating Prisma Client..."
npx prisma generate

echo ""
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init

echo ""
echo "✅ Prisma setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Start the backend: npm run dev"
echo "2. (Optional) Open Prisma Studio: npx prisma studio"

