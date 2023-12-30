package middleware

import (
	"github.com/dillonstreator/opentelemetry-go-contrib/instrumentation/net/http/otelhttp"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"log/slog"
)

func SetMiddleware(mux *chi.Mux, logger *slog.Logger) {
	mux.Use(middleware.Recoverer)
	mux.Use(TrustProxy(logger))
	mux.Use(otelhttp.NewMiddleware("chi"))
	mux.Use(requestLogger(logger))
	mux.Use(corsHeaders())
}
