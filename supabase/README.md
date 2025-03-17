# Supabase Migration Guide

This guide explains how to apply and rollback database migrations for the Cherry Mobile project using the Supabase CLI.

## Prerequisites

1. Install Supabase CLI
   ```bash
   # Using npm
   npm install -g supabase
   # Or using Homebrew
   brew install supabase/tap/supabase
   ```

2. Log in to Supabase CLI
   ```bash
   supabase login
   ```

## Project Setup

1. Link your project (only needed once)
   ```bash
   supabase link --project-ref <project-id>
   ```
   Replace `<project-id>` with your Supabase project ID found in your project's dashboard settings.

## Applying Migrations

1. Apply all pending migrations
   ```bash
   supabase db push
   ```

2. Apply specific migration (if needed)
   ```bash
   supabase db push --db-only <migration-name>
   ```

## Rolling Back Migrations

1. Reset the database to a specific migration
   ```bash
   supabase db reset --db-only
   supabase db push --db-only <migration-name>
   ```

## Migration Files

Current migration files in this project:

- `20240101000000_initial_schema.sql`: Creates the initial database schema including tables for books, categories, tags, users, and their relationships.
- `20240101000001_rls_policies.sql`: Implements Row Level Security (RLS) policies for data access control.

## Verifying Migrations

1. Check migration status
   ```bash
   supabase db status
   ```

2. View applied migrations
   ```bash
   supabase db list
   ```

## Troubleshooting

1. If migration fails:
   - Check the error message in the CLI output
   - Verify that all referenced tables and columns exist
   - Ensure there are no syntax errors in the SQL files
   - Check for circular dependencies in foreign key constraints

2. If you need to start fresh:
   ```bash
   supabase db reset
   ```
   Note: This will reset your database to its initial state. Use with caution in production.

## Best Practices

1. Always backup your database before applying migrations
2. Test migrations in a development environment first
3. Review migration files for potential issues before applying
4. Keep migration files small and focused
5. Use meaningful names for migration files

For more detailed information, refer to the [Supabase CLI documentation](https://supabase.com/docs/reference/cli/supabase-db-push).