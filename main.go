package main

import (
	"net/http"

	"github.com/Sirupsen/logrus"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/kelseyhightower/envconfig"

	"github.com/timberslide/gotimberslide"
)

// Spec are the env variables we're expecting
type Spec struct {
	Bind    string `envconfig:"bind" default:":8082"`
	TsHost  string `envconfig:"ts_host" default:"gw.timberslide.com:443"`
	TsToken string `envconfig:"ts_token"`
	TsTopic string `envconfig:"ts_topic"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

// GetStreamHandler stream our Timberslide topic events over websockets
func (s *Spec) GetStreamHandler() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var err error
		logrus.WithFields(logrus.Fields{"Method": r.Method, "Path": r.URL.Path})

		// Upgrade the connection to handle Websockets
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			logrus.Errorln(err.Error())
			return
		}

		// Create a Timberslide client and connect
		tsClient, err := ts.NewClient(s.TsHost, s.TsToken)
		if err != nil {
			logrus.Errorln(err.Error())
			return
		}
		if err = tsClient.Connect(); err != nil {
			logrus.Errorln(err.Error())
			return
		}

		// Start reading off events from Timberslide and writing out their message
		for event := range tsClient.Iter(s.TsTopic, ts.PositionNewest) {
			if err = conn.WriteMessage(websocket.TextMessage, []byte(event.Message)); err != nil {
				logrus.Errorln(err.Error())
				return
			}
		}
	})
}

func main() {
	var err error

	// Load our config from environment variables
	var s Spec
	if err = envconfig.Process("APP", &s); err != nil {
		logrus.Errorln(err.Error())
	}

	// Set up our webserver's routes
	r := mux.NewRouter()
	r.Handle("/stream", s.GetStreamHandler()).Methods("GET")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("build")))

	logrus.Infoln("Starting")
	err = http.ListenAndServe(s.Bind, r)
	if err != nil {
		logrus.Errorln(err.Error())
	}
}
