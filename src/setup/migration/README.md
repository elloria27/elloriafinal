
# Database Migration Files

This directory contains SQL migration files for setting up the Elloria database structure and initial data.

## Directory Structure

- `/tables/` - Contains SQL files for creating table structures
- `/data/` - Contains SQL files with initial data inserts

## Files Description

The migration process includes the following files:

- `pages_rows.sql` - Initial content pages data
- `products_rows.sql` - Product catalog initial data
- `profiles_rows.sql` - User profiles data
- `seo_settings_rows.sql` - SEO configuration
- `shop_settings_rows.sql` - Shop configuration and payment settings
- `site_settings_rows.sql` - Global site settings
- `user_roles_rows.sql` - User role assignments

## Migration Process

The migration runner executes these SQL scripts in the correct order, ensuring that:

1. All tables are created with proper structure and relationships
2. Initial data is inserted into the tables
3. Required indexes and constraints are created
4. Database functions and triggers are set up

## Adding Custom Migrations

To add custom migrations:

1. Create a new SQL file in the appropriate directory
2. Add the file path to the migration runner configuration
3. Test your migration locally before deploying
