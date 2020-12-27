package main

import (
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
	spotify "github.com/vudoan1708-cyber/go-server/components/handlers"
)

func SocketConnection(w http.ResponseWriter, r *http.Request) {
	log.Println("New Connection")
}

func Home(w http.ResponseWriter, r *http.Request) {
	log.Println("Home")
}

func SocketInit() {
	server, err := socketio.NewServer(nil)

	if err != nil {
		log.Fatal(err)
	}

	server.OnEvent("startup", "connection", func(s socketio.Conn) {
		log.Println("New Connection", s.ID())
	})
}

func SpotifyHandler(w http.ResponseWriter, r *http.Request) {
	spotify.redirectHandler(w, r)
}

func HandleRoutes(port string) {
	
	http.HandleFunc("/", Home)
	http.HandleFunc("/socketio", SocketConnection)
	http.HandleFunc("/spotify", SpotifyHandler)

	log.Fatal(http.ListenAndServe(port, nil))
}

func main() {
	port := ":5000"

	log.Println("Server is Running on port", port)

	HandleRoutes(port)
}
