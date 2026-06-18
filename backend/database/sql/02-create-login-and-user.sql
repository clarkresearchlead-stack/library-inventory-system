-- Creates a dedicated SQL login and database user for the Library Inventory API.
-- Replace YOUR_STRONG_PASSWORD with a password of at least 16 characters.
-- Run as a SQL Server administrator AFTER 01-create-database.sql.

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.server_principals WHERE name = N'library_app')
BEGIN
    CREATE LOGIN library_app
    WITH PASSWORD = N'YOUR_STRONG_PASSWORD',
         CHECK_POLICY = ON,
         CHECK_EXPIRATION = OFF;
END
GO

USE LibraryInventoryDb;
GO

IF NOT EXISTS (SELECT name FROM sys.database_principals WHERE name = N'library_app')
BEGIN
    CREATE USER library_app FOR LOGIN library_app;
END
GO

PRINT 'Login and user library_app created.';
GO
