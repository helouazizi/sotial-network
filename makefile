.PHONY: run-backend run-frontend run-all

run-backend:
	cd backend && go run cmd/main.go

run-frontend:
	cd frontend && npm run dev

run-all:
	(cd backend && go run cmd/main.go) & \
	(cd frontend && npm run dev)
