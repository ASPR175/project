## Running with Docker

```bash
# Start the app
docker compose up --build

# Stop
docker compose down

# Stop and wipe database
docker compose down -v
```

> Note: Run `npx prisma migrate deploy` manually if schema migrations are needed.
