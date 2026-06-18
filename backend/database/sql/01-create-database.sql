-- Creates the LibraryInventoryDb database for production use.
-- Run as a SQL Server administrator (sa or equivalent).

IF NOT EXISTS (
    SELECT name FROM sys.databases WHERE name = N'LibraryInventoryDb'
)
BEGIN
    CREATE DATABASE LibraryInventoryDb
    COLLATE SQL_Latin1_General_CP1_CI_AS;
END
GO

USE LibraryInventoryDb;
GO

PRINT 'Database LibraryInventoryDb is ready.';
GO
