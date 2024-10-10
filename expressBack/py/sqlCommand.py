import sqlite3
from sqlite3 import Error

def create_connection(db_file):
    """Crée une connexion à la base de données SQLite spécifiée par db_file."""
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print(f"Connexion établie avec succès à {db_file}")
    except Error as e:
        print(f"Erreur lors de la connexion à la base de données : {e}")
    return conn

def execute_sql(conn, sql_command):
    """Exécute une commande SQL sur la connexion de base de données spécifiée."""
    try:
        c = conn.cursor()
        c.execute(sql_command)
        conn.commit()
        print("Commande exécutée avec succès")
    except Error as e:
        print(f"Erreur lors de l'exécution de la commande : {e}")

def select_sql(conn, sql_command):
    """Exécute une commande SELECT SQL et retourne les résultats."""
    try:
        c = conn.cursor()
        c.execute(sql_command)
        rows = c.fetchall()
        return rows
    except Error as e:
        print(f"Erreur lors de l'exécution de la commande : {e}")
        return None

def main():
    database = "users.db"  # Remplacez par le chemin de votre fichier SQLite

    # Création d'une connexion à la base de données SQLite
    conn = create_connection(database)
    
    if conn:
        while True:
            # Demander une commande SQL à l'utilisateur
            sql_command = input("Entrez une commande SQL (ou 'exit' pour quitter) : ")
            
            if sql_command.lower() == 'exit':
                break
            
            # Détecter si la commande est une sélection (SELECT)
            if sql_command.strip().lower().startswith("select"):
                rows = select_sql(conn, sql_command)
                if rows:
                    print("Résultats de la sélection :")
                    for row in rows:
                        print(row)
            else:
                execute_sql(conn, sql_command)

        # Fermeture de la connexion
        conn.close()
        print("Connexion fermée")

if __name__ == '__main__':
    main()
