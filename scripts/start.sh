
echo "Running migrations..."
node_modules/.bin/prisma migrate deploy --schema=prisma/schema.prisma
echo "Starting app..."
node server.js