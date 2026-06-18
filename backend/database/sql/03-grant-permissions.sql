-- Grants least-privilege permissions to library_app.
-- Run AFTER 02-create-login-and-user.sql and AFTER EF migrations create tables.

USE LibraryInventoryDb;
GO

ALTER ROLE db_datareader ADD MEMBER library_app;
ALTER ROLE db_datawriter ADD MEMBER library_app;
GO

-- Allow EF migrations to manage schema (required for MigrateAsync on startup).
-- For stricter production, run migrations with an admin account and remove this grant.
GRANT ALTER ON SCHEMA::dbo TO library_app;
GRANT CREATE TABLE TO library_app;
GRANT REFERENCES ON SCHEMA::dbo TO library_app;
GO

-- Explicit table permissions (redundant with db_datareader/db_datawriter but documented)
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.users TO library_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.categories TO library_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.books TO library_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.inventory_logs TO library_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.__EFMigrationsHistory TO library_app;
GO

PRINT 'Permissions granted to library_app.';
GO
