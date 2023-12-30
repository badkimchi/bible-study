package main

import (
	"github.com/go-chi/chi"
	"net/http"
	"os"
	"path"
	"path/filepath"
)

func defineRoutes(mux *chi.Mux, cfg *Config) {
	cont, err := controllers()
	if err != nil {
		panic(err)
	}
	mux.Get(cfg.HealthEndpoint, handleHealthCheck)
	defineStaticRoutes(mux)
	defineAPIRoutes(cont, mux)
}

func defineStaticRoutes(mux *chi.Mux) {
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	workDir := filepath.Dir(ex)
	feDir := "web/dist"
	feBasePath := path.Join(workDir, feDir)
	mux.Get(
		"/assets/*", func(w http.ResponseWriter, r *http.Request) {
			fullFilePath := path.Join(feBasePath, r.URL.Path)
			w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			http.ServeFile(w, r, fullFilePath)
		},
	)

	mux.Get(
		"/", func(w http.ResponseWriter, r *http.Request) {
			fullFilePath := path.Join(feBasePath, "index.html")
			w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			http.ServeFile(w, r, fullFilePath)
			//w.Write([]byte(fullFilePath))
		},
	)
}

func defineAPIRoutes(cont reqControllers, mux *chi.Mux) {
	mux.Route("/api", func(api chi.Router) {
		api.Get("/test", cont.AuthC.TestGet)
	})
}

func handleHealthCheck(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(http.StatusOK)
}
