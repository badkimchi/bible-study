package auth

import (
	"app/util/resp"
	"net/http"
)

type Controller struct {
}

func NewAuthController() *Controller {
	return &Controller{}
}

func (c *Controller) TestGet(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	resp.OK(w, r, "test")
}
