package main

import (
	"GoWS/models"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"text/template"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 											TABLES
///////////////////////////////////////////////////////////////////////////////////////////////////////////
var tables []*models.Table
func RemoveTable(t *models.Table) {
	for i, table := range tables {
		if t == table {
			tables = append(tables[:i], tables[i+1:]...)
			break
		}
	}
}
func verifyTableID(ID string) *models.Table {
	for i := range tables {
		if tables[i].ID == ID {
			return tables[i]
		}
	}
	return nil
}
func getTableID() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprintf("%05d", rand.Intn(90000)+10000)
}
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 											ERROR
///////////////////////////////////////////////////////////////////////////////////////////////////////////

func returnError(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"error": "invalid request"})
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 									HOME MAIN ACTIVITY
///////////////////////////////////////////////////////////////////////////////////////////////////////////

func homeConnect(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	
	w.Header().Set("Content-Type", "application/json")

	id := r.URL.Query().Get("id")
	tableID := r.URL.Query().Get("table")

	displayView := r.URL.Query().Get("displayView")

	log.Printf("Received request: id=%s, table=%s", id, tableID)

	if id == "" && tableID == "" && displayView == ""{
		returnError(w)
		return
	}

	if id != "" && tableID != "" {
		// If someone wants to join a table
		table := verifyTableID(tableID)
		if table != nil {
			conn, err := upgrader.Upgrade(w, r, nil)
			if err != nil {
				log.Println("Upgrade error:", err)
				returnError(w)
				return
			}
			models.GetNewClient(id, table, conn)
		} else {
			returnError(w)
			return
		}
	} else if displayView != "" && tableID != "" {
		table := verifyTableID(tableID)

		if table != nil {
			conn, err := upgrader.Upgrade(w, r, nil)
			if err != nil {
				log.Println("Upgrade error:", err)
				returnError(w)
				return
			}
			models.GetNewDV(table, conn)
		}
	} else {
		returnError(w)
		return
	}
}

func postHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Décoder les données JSON reçues dans une structure Go
	var questionsData models.QuestionsData
	if err := json.NewDecoder(r.Body).Decode(&questionsData); err != nil {
		log.Println("Error decoding request body:", err)
		returnError(w)
		return
	}
	newTable := models.NewTable(getTableID(), questionsData)
	tables = append(tables, newTable)
	go newTable.GameStart() //// création boucle Jeu

	response := map[string]interface{}{
		"id":		newTable.ID,
		"status":    "success",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func homePage(w http.ResponseWriter, r *http.Request) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default to 8080 if PORT is not set
	}

	// Define a simple HTML template
	tmpl := `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Server Info</title>
	</head>
	<body>
		<h1>Server is running on port: {{.Port}}</h1>
	</body>
	</html>
	`

	// Parse and execute the template, passing the port as data
	t := template.New("homepage")
	t, err := t.Parse(tmpl)
	if err != nil {
		log.Println("Error parsing template:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	data := struct {
		Port string
	}{
		Port: port,
	}

	t.Execute(w, data)
}

// Middleware function to handle CORS
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 										HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Supprimme les tables pas actives
func verifiyActivity() {
	for {
		for _, t := range tables {
			if len(t.Clients) == 0 {
				RemoveTable(t)
				fmt.Printf("Table remouved id: ,%s", t.ID)
			}
		}
		time.Sleep(3 * time.Minute)
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 											MAIN
///////////////////////////////////////////////////////////////////////////////////////////////////////////
func main() {
	// Create a new router
	r := mux.NewRouter()

	// Define routes and handlers
	r.HandleFunc("/homePage", homePage).Methods("GET")
	r.HandleFunc("/", homeConnect).Methods("GET", "OPTIONS")
	r.HandleFunc("/newTable", postHandler).Methods("POST", "OPTIONS")

	// Apply CORS middleware
	r.Use(corsMiddleware)

	// Get the port from the environment variable
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default to 8080 if PORT is not set
	}

	go verifiyActivity()

	// Start the server
	fmt.Printf("Server is running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
