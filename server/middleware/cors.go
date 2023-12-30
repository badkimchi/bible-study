package middleware

import (
	"github.com/go-chi/cors"
	"net/http"
)

func corsHeaders() func(http.Handler) http.Handler {
	corsOptions := cors.New(
		cors.Options{
			AllowedOrigins: []string{"*"},
			AllowedMethods: []string{
				"GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS",
			},
			AllowedHeaders: []string{
				"X-PINGOTHER", "Accept", "Origin", "X-Auth-Token", "Authorization",
				"Content-Type", "X-CSRF-Token", "Cache-Control", "Pragma",
			},
			ExposedHeaders:   []string{"Link"},
			AllowCredentials: true,
			MaxAge:           3600,
		},
	)
	return corsOptions.Handler
}
