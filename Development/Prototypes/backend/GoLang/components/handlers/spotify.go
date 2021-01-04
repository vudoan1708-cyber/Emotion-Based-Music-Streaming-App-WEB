package handlers

import (
	"net/http"

	"github.com/vudoan1708-cyber/go-server/components/utils"
	"github.com/zmb3/spotify"
)

// the user will eventually be redirected back to the redirect URL
func redirectHandler(w http.ResponseWriter, r *http.Request) {

	SPOTIFY_CLIENT_ID := utils.GetEnv("SPOTIFY_CLIENT_ID")
	SPOTIFY_CLIENT_SECRET := utils.GetEnv("SPOTIFY_CLIENT_SECRET")
	REDIRECT_URI := utils.GetEnv("REDIRECT_URI")
	// var FRONTEND_URI = utils.GetEnv("FRONTEND_URI")
	STATE_KEY := utils.GetEnv("STATE_KEY")

	auth := spotify.NewAuthenticator(REDIRECT_URI, spotify.ScopeUserReadPrivate)

	auth.SetAuthInfo(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)

	// url := auth.AuthURL(STATE_KEY)

	// use the same state string here that you used to generate the URL
	token, err := auth.Token(STATE_KEY, r)
	if err != nil {
		http.Error(w, "Couldn't get token", http.StatusNotFound)
		return
	}
	// create a client using the specified token
	auth.NewClient(token)

	// the client can now be used to make authenticated requests
}
