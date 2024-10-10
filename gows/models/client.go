package models

import (
	"encoding/json"
	"log"
	"net"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
)

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 										CLIENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Client represents a single client connection.
type Client struct {
	ID      string
	Table   *Table
	Conn    *websocket.Conn
	Channel chan string
	Done    chan struct{} // Channel to signal when the client is done
	closed  int32         // Atomic flag to check if Done channel is closed
	mu      sync.Mutex    // Mutex to protect connection
	Score 	int
	Queue  Queue
}

// GetNewClient creates a new Client instance with the given parameters.
func GetNewClient(id string, table *Table, conn *websocket.Conn) *Client {
	client := &Client{
		ID:      id,
		Table:   table,
		Conn:    conn,
		Channel: make(chan string),
		Done:    make(chan struct{}),
		Score: 	 0,
		Queue:	 Queue{},

	}
	table.AddClient(client)
	
	// Send message to clients
	go client.SendToClient()

	// Start a goroutine to handle client messages and disconnection
	go client.ClientReceiveMessage()

	// Start a goroutine to handle client cleanup on disconnection
	go func() {
		<-client.Done
		table.RemoveClient(client)
	}()

	return client
}
func GetNewDV(table *Table, conn *websocket.Conn) *Client {
	client := &Client{
		ID:      "Displayer",
		Table:   table,
		Conn:    conn,
		Channel: make(chan string),
		Done:    make(chan struct{}),
		Queue: Queue{},
	}
	table.AddDV(client)

	go client.SendToClient()
	
	go client.ClientReceiveMessage()

	// Start a goroutine to handle client cleanup on disconnection
	go func() {
		<-client.Done
		table.RemoveClient(client)
	}()

	return client
}

// ClientReceiveMessage listens for messages from the WebSocket connection.
func (c *Client) ClientReceiveMessage() {
	defer func() {
		c.mu.Lock()
		defer c.mu.Unlock()
		c.Conn.Close()
		c.safeCloseStringChannel(c.Channel)
		c.safeCloseStructChannel(c.Done)
	}()

	for {
		_, msg, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsCloseError(err, websocket.CloseNormalClosure) || isClosedConnError(err) {
				log.Printf("Connection closed: %v", err)
			} else {
				log.Printf("Error reading message: %v", err)
			}
			break
		}
        // A VOIR ICI QUE FAIS-JE DES MESSAGE
		var message Message
		err = json.Unmarshal(msg, &message)
		if err != nil {
			log.Printf("JSON unmarshal error: %v", err)
			continue
		}
		c.Table.gameManager.ReciveMessage(c, message.Type, message.Content)
		
	}
}
// Send sends a message to the client.
func (c *Client) Send(msg Message) {
	c.Queue.Enqueue(msg)
}

func (c *Client) SendToClient() {
	for {
		if !c.Queue.IsEmpty() {
			msg, err := c.Queue.Dequeue()
			if err == nil {
				jsonData, err := json.Marshal(msg)
				if err != nil {
					log.Println("JSON marshal error:", err)
					continue // Continue to the next iteration instead of return
				}

				c.mu.Lock()
				err = c.Conn.WriteMessage(websocket.TextMessage, jsonData)
				c.mu.Unlock()

				if err != nil {
					log.Println("Write error:", err)
					continue
				}
			}
		}
		time.Sleep(750 * time.Millisecond)
	}
}
// safeCloseStringChannel safely closes a string channel
func (c *Client) safeCloseStringChannel(ch chan string) {
	select {
	case <-ch:
		// Channel is already closed
	default:
		close(ch)
	}
}
// safeCloseStructChannel safely closes a struct channel
func (c *Client) safeCloseStructChannel(ch chan struct{}) {
	if atomic.CompareAndSwapInt32(&c.closed, 0, 1) {
		close(ch)
	}
}
// isClosedConnError checks if an error is due to use of a closed network connection.
func isClosedConnError(err error) bool {
	netErr, ok := err.(*net.OpError)
	if !ok {
		return false
	}
	return netErr.Err.Error() == "use of closed network connection"
}
