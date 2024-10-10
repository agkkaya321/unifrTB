package models

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"strconv"
	"strings"
	"sync"
	"time"
)

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 										STRUCT & CONSTRUCTOR
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// GameManager handles the game logic for a table.
type GameManager struct {
	Table        		*Table
	ResponseList 		[]ResponseWaitList
	QuestionDataList 	[]QuestionData
	mu           		sync.Mutex
	DVGO 				bool
}
// NewGameManager crée un nouveau GameManager pour une table donnée.
func NewGameManager(table *Table) *GameManager {
	gm :=  &GameManager{
		Table:        		table,
		ResponseList: 		make([]ResponseWaitList, 0),
		QuestionDataList: 	make([]QuestionData, 0),
		DVGO: false,
	}
	//go gm.update()//// A VOIR        
	return gm
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 										UPDADE CLIENT				
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fais pour thread Changer ça !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// func (gm *GameManager) update(){
// 	for{
// 		if gm.Table.Phase > 2{return}
// 		gm.updateClientIDs()
// 		gm.updateClientPhase()
// 		time.Sleep(5 * time.Second)//A changer
// 	}
// }
func (gm *GameManager) updateClientIDs() {
	t := gm.Table

	t.clientMu.Lock()
	defer t.clientMu.Unlock()

	var clientIDs []string
	for _, c := range t.Clients {
		clientIDs = append(clientIDs, c.ID)
	}

	clientIDsJSON, err := json.Marshal(clientIDs)
	if err != nil {
		fmt.Println("Error marshalling client IDs:", err)
		return
	}

	gm.Table.SendToC(*NewMessage("nbJoueur", string(clientIDsJSON)))
	gm.Table.SendToDVs(*NewMessage("nbJoueur", string(clientIDsJSON)))
}
func (gm *GameManager) updateClientPhase() {
	t := gm.Table
	t.clientMu.Lock()
	defer t.clientMu.Unlock()

	gm.Table.SendToC(*NewMessage("changePhase", strconv.Itoa(t.Phase)))
	gm.Table.SendToDVs(*NewMessage("changePhase", strconv.Itoa(t.Phase)))
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 										RECIVE MESSAGE
//////////////////////////////////////////////////////////////////////////////////////////////////////////
func (gm *GameManager) ReciveMessage(client *Client, t string, c string) {
	// phase 0
	if gm.Table.Phase == 0 && t == "starter"{
		gm.ListManager(client, c)
	}
	// phase 1
	if  gm.Table.Phase == 1 && t == "data"{
		gm.ListManagerData(client, c)

	}
	if gm.Table.Phase > 1 && t == "reponseQuiz"{
		gm.ListManagerReponse(client, c)
	}
	if t == "DVOK"{
		gm.DVGO = true
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 										LIST MANAGERS
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Quand y aune nouvelle reponses l'ajoute ou actualise la liste
func (gm *GameManager) ListManager(c *Client, r string) {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	for i, rw := range gm.ResponseList {
		if rw.Client == c {
			// Mise à jour de la réponse existante
			gm.ResponseList[i].Response = r
			gm.ResponseList[i].Data = nil
			return
		}
	}
	// Ajouter une nouvelle entrée pour le client
	gm.ResponseList = append(gm.ResponseList, ResponseWaitList{Client: c, Response: r, Data: nil})
}
func (gm *GameManager) ListManagerData(c *Client, r string) {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	data, err := JsonStringToArray(r)

	if err != nil {
		fmt.Println("Error parsing JSON:", err)
	} else {
		for i := range data {
			data[i].Qui = c.ID
		}
	}

	fmt.Println(data)

	for i, rw := range gm.ResponseList {
		if rw.Client == c {
			// Mise à jour de la réponse existante
			gm.ResponseList[i].Response = r
			gm.ResponseList[i].Data = data
			return
		}
	}
	// Ajouter une nouvelle entrée pour le client
	gm.ResponseList = append(gm.ResponseList, ResponseWaitList{Client: c, Response: r, Data: data})
}
func (gm *GameManager) ListManagerReponse(c *Client, r string){
	gm.mu.Lock()
	defer gm.mu.Unlock()

	fmt.Println("ici: ", r)
	// traiter ici message
	for i, rw := range gm.ResponseList{
		if rw.Client == c {
			gm.ResponseList[i].Response = r
			var responseQuiz ResponseQuiz
			parts := strings.Split(r, ",")
			if len(parts) == 2 {
				
				responseQuiz.Player1 = parts[0]
				responseQuiz.Player2 = parts[1]

				// Assign the parsed responseQuiz to the appropriate place if needed
				gm.ResponseList[i].ResponseQuiz = responseQuiz
			} else {
				responseQuiz.Player1 = ""
				responseQuiz.Player2 = ""
				}
			gm.ResponseList[i].ResponseQuiz = responseQuiz
		}
	}
}

// Sumpprime les reponses d'un client qui se deconect
func (gm *GameManager) RemoveClient(client *Client) {
	gm.mu.Lock()
	defer gm.mu.Unlock()
	for i, rw := range gm.ResponseList {
		if rw.Client == client {
			gm.ResponseList = append(gm.ResponseList[:i], gm.ResponseList[i+1:]...)
			break
		}
	}
}
// Sumprimme toute les reponses
func (gm *GameManager) cleanList() {
	for i := range gm.ResponseList {
		gm.ResponseList[i].Response = ""
		gm.ResponseList[i].Data = nil
		gm.ResponseList[i].ResponseQuiz = ResponseQuiz{}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 										SYCRONISATION
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// verifySync checks if all responses in the ResponseList are not nil
func (gm *GameManager) verifySync() bool {
    for _, rw := range gm.ResponseList {
        if (rw.Response == "") && (rw.Data == nil) {
            return false
        }
    }
	return true
}
func (gm *GameManager) verifyAllTrue() bool {
	for _, rw := range gm.ResponseList {
		if rw.Response != "true" {
			return false
		}
	}
	return true
}
func (gm *GameManager) verifySyncRep() bool {
    for _, rw := range gm.ResponseList {
        if (rw.Response == "") && (rw.ResponseQuiz == ResponseQuiz{}){
            return false
        }
    }
	return true
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 										UTILS
//////////////////////////////////////////////////////////////////////////////////////////////////////////
func (gm *GameManager) getQuestions(n int) [][]string {
	q := gm.Table.Questions.Questions
	var result [][]string

	rand.Seed(time.Now().UnixNano())
	for i := 0; i < n; i++ {
		picks := make([]string, 3)
		for j := 0; j < 3; j++ {
			picks[j] = q[rand.Intn(len(q))].Q
		}
		result = append(result, picks)
	}
	return result
}

// Compare les reponse et ajoute point si reponses juste
func (gm *GameManager) verifiyRep(q QuestionData) {
    for i := range gm.ResponseList {
        rl := &gm.ResponseList[i]
        if rl.ResponseQuiz.Player1 == q.Qui {
            rl.Client.Score++
        }
        if rl.ResponseQuiz.Player2 == q.Pourqui {
            rl.Client.Score++
        }
    }
}
func (gm *GameManager) getResult() []Result {
    var result []Result
    for _, rl := range gm.ResponseList {
        result = append(result, Result{
            ID:    rl.Client.ID,
            R1:    rl.ResponseQuiz.Player1,
            R2:    rl.ResponseQuiz.Player2,
            Score: rl.Client.Score,
        })
    }
    return result
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// 										GAME PARTS
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Envoie cmb de client y a actuellemnt au clients
// Attends de recevoir tous les starter true
// Phase 0
func (gm *GameManager) starter() {
	t := gm.Table
	for {
		select {
		case <-t.clientAddedCh:
			gm.updateClientIDs()
			gm.updateClientPhase()
		case <-t.clientremoveCh:
			gm.updateClientIDs()
			gm.updateClientPhase()
		default:
		}
		if len(gm.ResponseList) == len(t.Clients) && len(gm.ResponseList) > 1 && gm.verifyAllTrue() {
			t.ChangePhase(t.Phase + 1)
			gm.cleanList()
			// Update clients and Dvs phase
			gm.updateClientPhase()
			return
		}
		time.Sleep(500 * time.Millisecond)
	}
}
// Recupere les question et envoie a tous les clients les questions
// Puis attends les réponses pour toutes les questions
// Phase 1
func (gm *GameManager) phaseSendQuestion(){
	questions := gm.getQuestions(len(gm.Table.Clients))

	for i, rw := range gm.ResponseList {
		jsonData, err := json.Marshal(questions[i])
		if err != nil {
			fmt.Println("Error marshalling questions:", err)
			return
		}
		rw.Client.Send(*NewMessage("questionsRound", string(jsonData)))
	}
	for {
		if gm.verifySync() {
			for _, rl := range gm.ResponseList {
				gm.QuestionDataList = append(gm.QuestionDataList, rl.Data...)
			}

			fmt.Println(gm.QuestionDataList)

			gm.cleanList()
			gm.Table.ChangePhase(gm.Table.Phase + 1)
			gm.updateClientPhase()
			return
		}
		time.Sleep(1 * time.Second)
	}
}

// Recuprer la liste []QuestionDataList envoyer chauqe question à la table et au client 
// Puis attendre à chauqe fois la syncronisation
// Phase 2
func (gm *GameManager) phaseReponses(){
	for _,question := range gm.QuestionDataList{

		// send all client the question
		gm.Table.SendToC(*NewMessage("question", QuestionToString(question)))
		gm.Table.SendToDVs(*NewMessage("question", QuestionToString(question)))
		
		// wait until all client response
		for{
			if gm.verifySyncRep(){
				// Verifier les reponses
				// Donner ordre pour display la reponse puis attendre pour question suivante
				// Donner un temps puis envoyer pour passer à la question quivante
				gm.verifiyRep(question)

				fmt.Println(question)


				for i, response := range gm.ResponseList {
					fmt.Printf("les reponses recu [%d]: %+v\n", i, response.ResponseQuiz)
				}


				for _, rl := range(gm.ResponseList){
					fmt.Println(rl.Client.Score)

				}


				results := gm.getResult()

				// Convertir les résultats en chaîne JSON
				resultString, err := ResultsToJSON(results)
				if err != nil {
					fmt.Println("Erreur lors de la conversion en JSON:", err)
					return
				}

				// Envoyer les résultats via SendToDVs
				gm.Table.SendToDVs(*NewMessage("RepList", resultString))

				// Wait until DVOKAY
				for{
					if(gm.DVGO){break}
				}

				gm.cleanList()
				gm.DVGO = false
				

				break
			}
		time.Sleep(1* time.Second)
		}
	}
	// Send all data score
	gm.Table.ChangePhase(gm.Table.Phase + 1)
}