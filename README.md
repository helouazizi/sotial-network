# 🌐 social-network – Facebook-like Social Network

**social-network** is a full-stack social networking platform inspired by Facebook. Users can create profiles, follow others, publish posts, join groups, receive notifications, and chat in real-time. It was developed as a collaborative learning project using modern web technologies.

---

## 🧩 Features

- 👤 **User Profiles** – Customizable user profiles with avatars and personal info
- 🧑‍🤝‍🧑 **Followers** – Follow/unfollow other users to build your own network
- 📝 **Posts** – Create, and read posts; engage with the feed
- 👥 **Groups** – Create and join groups around shared interests or communities
- 🔔 **Notifications** – Stay informed with real-time notifications
- 💬 **Chats** – Real-time private messaging using WebSockets

---

## 🛠️ Tech Stack

### 🧭 Frontend
- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: TypeScript / JavaScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **API Communication**: WebSockets

### 🔧 Backend
- **Language**: [Go (Golang)](https://go.dev/)
- **Architecture**: Layered architecture
  - Handler (HTTP)
  - Service (Business logic)
  - Repository (Data access)
- **WebSockets**: Real-time messaging

### 🗃️ Database
- **Engine**: SQLite3 – Lightweight SQL database ideal for development

---

## ⚙️ Getting Started
First, clone the repository and install frontend dependencies:

```bash
git clone https://github.com/ismailsayen/social-network.git
cd social-network/frontend
npm install
cd ..
```

You can run this project using either a **Makefile** or **Docker Compose**.

### Option 1: Using Makefile

```bash
make run-frontend   # Run the frontend
make run-backend    # Run the backend
make run-all        # Run both frontend and backend
```
### Option 2: Using Docker Compose

```bash
docker-compose up --build   # Build and start all services
docker-compose down         # Stop and remove containers
```


## 👨‍💻 Team & Creators

| Name         | GitHub                                      | LinkedIn                                         |
| ------------ | ------------------------------------------- | ------------------------------------------------|
| Ismail Hajji | [github.com/hajji-Ismail](https://github.com/hajji-Ismail) | [linkedin.com/in/ismail-hajji](https://www.linkedin.com/in/ismail-hajji) |
|Youssef El Asri   | [github.com/yelasri07](https://github.com/yelasri07)       | [linkedin.com/in/youssef-elasri48](https://www.linkedin.com/in/youssef-elasri48)       |
| Ismail Sayen  | [github.com/ismailsayen](https://github.com/ismailsayen)       | [linkedin.com/in/ismail-sayen-aa816a325](https://www.linkedin.com/in/ismail-sayen-aa816a325)       |
|Hassan El ouazizi  | [github.com/helouazizi](https://github.com/helouazizi)       | [linkedin.com/in/helouazizi](https://www.linkedin.com/in/helouazizi/)       |
