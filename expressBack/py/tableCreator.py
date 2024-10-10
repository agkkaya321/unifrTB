import sqlite3

# Connect to the database (or create a new one if it doesn't exist)
conn = sqlite3.connect('../users.db')

# Create a cursor to interact with the database
cursor = conn.cursor()

# SQL to create the tables with cascading deletes
create_tables_sql = """
PRAGMA foreign_keys = ON;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(255),
    email VARCHAR(255),
    pass VARCHAR(255)
);

CREATE TABLE ldq (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pid INT,
    nom VARCHAR(255),
    FOREIGN KEY (pid) REFERENCES users(id)
);

CREATE TABLE question (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listid INT,
    q VARCHAR(255),
    FOREIGN KEY (listid) REFERENCES ldq(id) ON DELETE CASCADE
);
"""

# Execute the SQL script to create the tables
cursor.executescript(create_tables_sql)

# Save the changes
conn.commit()

# Close the connection to the database
conn.close()

print("Tables 'users', 'ldq', and 'question' created with cascading deletes on 'question'.")
