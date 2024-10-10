package models

import (
	"encoding/json"
)

// Message struct definition
type Message struct {
    Type    string `json:"type"`
    Content string `json:"content"`
}

// NewMessage creates a new Message with a string content wrapped in a slice
func NewMessage(t string, c string) *Message {
    return &Message{
        Type:    t,
        Content: c,
    }
}

// ResponseWaitList wraps the Client and ResponseData structures
type ResponseWaitList struct {
    Client   *Client  `json:"client"`
    Response string `json:"response"`
	Data 	[]QuestionData `json:"data"`
	ResponseQuiz ResponseQuiz `json:"rep"`
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 										CONTENT TYPE
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define the structure for the JSON data
type QuestionData struct {
    Pourqui  string `json:"pourqui"`
    Question string `json:"question"`
    Response string `json:"reponse"`
	Qui string `json:"qui"`
}

type ResponseQuiz struct{
	Player1 string `json:"p1"`
	Player2 string `json:"p2"`
}

type Result struct{
	ID string `json:"id"`
	R1 string `json:"r1"`
	R2 string `json:"r2"`
	Score int `json:"score"`
}

type Question struct {
	ID     int    `json:"id"`
	ListID int    `json:"listid"`
	Q      string `json:"q"`
}

type QuestionsData struct {
	Questions []Question `json:"questions"`
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 										CONVERT
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to convert JSON string to a flat array of QuestionData
func JsonStringToArray(jsonString string) ([]QuestionData, error) {
	var questions []QuestionData

	// Deserialize the JSON into an array of QuestionData
	err := json.Unmarshal([]byte(jsonString), &questions)
	if err != nil {
		return nil, err
	}

	return questions, nil
}

func QuestionToString(question QuestionData) (string){
	jsonData, err := json.Marshal(question)
	if err != nil {
		return string("Error marshalling to JSON")
		
	}

	// Convert the JSON byte slice to a string
	jsonString := string(jsonData)
	return jsonString
}

func ResultsToJSON(results []Result) (string, error) {
    jsonData, err := json.Marshal(results)
    if err != nil {
        return "", err
    }
    return string(jsonData), nil
}
