package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/ismailsayen/social-network/pkg/utils"
)

type RateLimiter struct {
	sync.Mutex
	requests      int
	lastResetTime time.Time
}

var (
	rateLimiters = make(map[string]*RateLimiter)
	rateLimit    = 5
	window       = time.Minute
	mu           sync.Mutex
)

func RateLimitMiddleware(next http.Handler) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := getIP(r)

		mu.Lock()
		limiter, exists := rateLimiters[ip]
		if !exists {
			limiter = &RateLimiter{
				requests:      0,
				lastResetTime: time.Now(),
			}
			rateLimiters[ip] = limiter
		}
		mu.Unlock()

		limiter.Lock()
		defer limiter.Unlock()

		if time.Since(limiter.lastResetTime) > window {
			limiter.requests = 0
			limiter.lastResetTime = time.Now()
		}

		if limiter.requests >= rateLimit {
			utils.ResponseJSON(w, http.StatusTooManyRequests, map[string]any{
				"error": "Too many requests. Please wait before trying again.",
			})
			return
		}

		limiter.requests++
		next.ServeHTTP(w, r)
	})
}

func getIP(r *http.Request) string {
	ip := r.Header.Get("X-Forwarded-For")
	if ip == "" {
		ip = r.RemoteAddr
	}

	return ip
}
