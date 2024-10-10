import sqlite3

# Connecter à la base de données (ou créer une nouvelle base de données si elle n'existe pas)
conn = sqlite3.connect('../users.db')

# Créer un curseur pour interagir avec la base de données
cursor = conn.cursor()

# Fonction pour vérifier l'existence d'une ligne dans une table
def row_exists(table, column, value):
    cursor.execute(f"SELECT 1 FROM {table} WHERE {column} = ?", (value,))
    return cursor.fetchone() is not None

# Vérifier et insérer les données dans la table users
user_nom = 'a'
user_email = 'a@a'
user_pass = 'pass'

if not row_exists('users', 'email', user_email):
    cursor.execute("INSERT INTO users (nom, email, pass) VALUES (?, ?, ?)", (user_nom, user_email, user_pass))
    user_id = cursor.lastrowid
else:
    cursor.execute("SELECT id FROM users WHERE email = ?", (user_email,))
    user_id = cursor.fetchone()[0]

# Vérifier et insérer les données dans la table ldq
ldq_nom = 'Basic'

if not row_exists('ldq', 'nom', ldq_nom):
    cursor.execute("INSERT INTO ldq (pid, nom) VALUES (?, ?)", (user_id, ldq_nom))
    ldq_id = cursor.lastrowid
else:
    cursor.execute("SELECT id FROM ldq WHERE nom = ?", (ldq_nom,))
    ldq_id = cursor.fetchone()[0]

# Vérifier et insérer les données dans la table question
questions = ['question1', 'question2', 'question3']

for question in questions:
    if not row_exists('question', 'q', question):
        cursor.execute("INSERT INTO question (listid, q) VALUES (?, ?)", (ldq_id, question))

# Sauvegarder les changements
conn.commit()

# Fermer la connexion à la base de données
conn.close()

print("Données insérées ou vérifiées avec succès dans les tables 'users', 'ldq' et 'question'.")
