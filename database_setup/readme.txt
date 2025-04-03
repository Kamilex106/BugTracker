/********************************************************************************
* PostgreSQL Database Initialization Files
* This directory includes files for initializing and setting up a PostgreSQL 
* database using Docker.
*********************************************************************************/

/*
 * Instructions to use PostgreSQL with Docker:
 */

// Step 1: Start the Docker containers in the background
// Navigate to the directory with `docker-compose.yml` file, then run the command below:
docker compose up -d

// Step 2: Log into the PostgreSQL database inside the running container
// Use the following command to access the database:
docker exec -it db_pz psql -U user_pz -d db_pz

// Step 3: Show all tables in the database
// Run this command inside PostgreSQL to list all tables:
\dt

// Step 4: View data from a specific table
// For example, to view all rows from the 'category' table:
SELECT * FROM category;

// Step 5: Exit the PostgreSQL session
// Use the following command to exit the PostgreSQL CLI:
\q

// Step 6: Stop the running containers (without removing volumes)
docker compose down

// Step 7: Load sample data into the database
// To run SQL script(s) and load the sample data from the "sample_data.sql" file:
\i /docker-entrypoint-initdb.d/sample_data.sql

// Step 8: Stop the container and remove the volumes
// If you want to stop the container and remove any associated Docker volumes:
docker compose down --volumes

// Step 9: Show all Docker volumes
// This command lists all Docker volumes on your system:
docker volume ls

// Step 10: View container logs
// To view logs of a specific container (e.g., 'db_pz' container):
docker logs db_pz