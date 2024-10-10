package models

import (
	"fmt"
	"sync"
)

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 											TABLE
///////////////////////////////////////////////////////////////////////////////////////////////////////////

type Table struct {
	ID            string
	Questions     QuestionsData
	Clients       []*Client
	DisplayViews  []*Client
	Phase         int
	clientMu      sync.Mutex // Mutex to protect Clients slice
	clientAddedCh chan struct{}
	clientremoveCh chan struct{}
	gameManager *GameManager
}

func NewTable(id string, questions QuestionsData) *Table {
	t := &Table{
		ID:            	id,
		Questions: 		questions,
		Clients:       []*Client{},
		DisplayViews:  []*Client{},
		Phase:         0,
		clientAddedCh: make(chan struct{}, 1),
		clientremoveCh: make(chan struct{}, 1),
	}

	// Initialize GameManager with reference to Table
	t.gameManager = NewGameManager(t)
	return t
}

func (t *Table) AddClient(client *Client) {
	t.clientMu.Lock()
	defer t.clientMu.Unlock()
	t.Clients = append(t.Clients, client)
	// Signal that a new client has been added
	select {
	case t.clientAddedCh <- struct{}{}:
	default:
		// If the channel is already full, do nothing
	}
}
func (t *Table) SendToC(msg Message){
	for _, c := range t.Clients{
		c.Send(msg)
	}
}
func (t *Table) AddDV(client *Client) {
	t.clientMu.Lock()
	defer t.clientMu.Unlock()
	t.DisplayViews = append(t.DisplayViews, client)
	// Signal that a new client has been added
	select {
	case t.clientAddedCh <- struct{}{}:
	default:
		// If the channel is already full, do nothing
	}
}
func(t *Table) SendToDVs(msg Message){
	for _ ,dv := range t.DisplayViews{
		dv.Send(msg)
	}
}
func (t *Table) RemoveClient(client *Client) {
	t.clientMu.Lock()
	defer t.clientMu.Unlock()
	for i, c := range t.Clients {
		if c == client {
			t.Clients = append(t.Clients[:i], t.Clients[i+1:]...)
			t.gameManager.RemoveClient(client)
			select{
			case t.clientremoveCh <- struct{}{}:
			default:
			}
			break
		}
	}
	for i, c := range t.DisplayViews {
		if c == client {
			t.DisplayViews = append(t.DisplayViews[:i], t.DisplayViews[i+1:]...)
			select{
			case t.clientremoveCh <- struct{}{}:
			default:
			}
			break
		}
	}
}
func (t *Table) ChangePhase(phase int){
	t.clientMu.Lock()
	defer t.clientMu.Unlock()
	t.Phase = phase
}
func (t *Table) GameStart() {
	for {
		if t.Phase == 0 {
			t.gameManager.starter()
		}

		if t.Phase == 1{
			fmt.Println("Phase1")
			t.gameManager.phaseSendQuestion()
		}
		if t.Phase == 2 {
			fmt.Println("Phase2")
			t.gameManager.phaseReponses()
		}
		if t.Phase > 2{
			t.SendToC(*NewMessage("end", "true"))
			t.SendToDVs(*NewMessage("end", "true"))
			// annule go runtime aussi || table -> update()
			break
		}
	}
}
