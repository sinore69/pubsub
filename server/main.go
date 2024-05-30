package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Message struct {
	Count int
	Text  string
}

type App struct {
	MessageCount    int
	Clients         map[chan Message]bool
}

var upgrader = websocket.Upgrader{
	// Allow all connections by default
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (App *App) echo(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	//defer conn.Close()
	ch := make(chan Message)
	if App.Clients==nil{
		App.Clients=make(map[chan Message]bool)	
		App.Clients[ch]=true
	}
	go write(ch, conn,App)
	go read(conn,App,ch)

}
func read(conn *websocket.Conn, App *App,ch chan<-Message) {
	msg := Message{}
	for {
		_,text,err := conn.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}
		App.MessageCount++
		msg.Count = App.MessageCount
		msg.Text=string(text)
		ch <- msg
	}
}

func write(ch <-chan Message, conn *websocket.Conn,App *App) {
	for msg := range ch {
		fmt.Println(msg,ch)
		fmt.Println(App.Clients)
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
