package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Message struct {
	Sub  string
	Text string
}

type App struct {
	i int
}

var upgrader = websocket.Upgrader{
	// Allow all connections by default
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var collection map[string]chan Message = make(map[string]chan Message)

func (App *App) echo(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer conn.Close()
	msg := Message{}
	App.i++
	fmt.Println(App.i)
	for {
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Println("read:", err)
			break
		}
		collection["12"] = make(chan Message)
		go listen(collection["12"], conn)
		collection["12"] <- msg
		close(collection["12"])
	}
}

func listen(ch <-chan Message, conn *websocket.Conn) {
	for msg := range ch {
		fmt.Println(msg)
		conn.WriteJSON(msg)
	}
}

func main() {
	app := &App{}
	http.HandleFunc("/echo", app.echo)
	log.Println("Server started at :5000")
	err := http.ListenAndServe(":5000", nil)
	if err != nil {
		log.Fatal("Error starting server:", err)
	}
}
