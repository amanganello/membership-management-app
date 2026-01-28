# Database Setup

This directory contains PostgreSQL initialization scripts that run automatically when the Docker container starts for the first time.

## Files

- **01_schema.sql** - Creates all tables, constraints, triggers, and views
- **02_seed.sql** - Inserts sample membership plans

## Execution Order

Files are executed in alphabetical order by the PostgreSQL Docker image:
1. `01_schema.sql` - Schema setup
2. `02_seed.sql` - Sample data

## Testing

After running `docker compose up`, verify the setup:

```bash
# Connect to the database
docker exec -it memberapp-db psql -U postgres -d memberapp

# Check tables
\dt

# Check plans
SELECT * FROM plans;

# Exit
\q
```
