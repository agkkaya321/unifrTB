# unifrTB

# Online Gaming Platform

This project is a Bachelor thesis by Ali Gökkaya, developed under the supervision of Prof. Dr. Jacques Pasquier-Rocha at the University of Fribourg. The goal is to create an interactive online gaming platform where users can create accounts, host game sessions, and invite other players to join via a unique code. The platform ensures real-time synchronization across all players for an immersive experience.

## Features

- **User Accounts**: Users can register and log in to create and manage their own game sessions.
- **Interactive Game Sessions**: Hosts can start a game session, which provides a unique code that other players use to join the session.
- **Real-Time Synchronization**: The platform utilizes WebSocket to synchronize game rounds across all players in real-time.

## Technology Stack

- **Frontend**: Developed with React and Bootstrap for a responsive user interface.
- **Backend**: Built using Node.js for API management and Go for game session management.
- **Database**: SQLite for secure and efficient storage of user and game session data.
- **Real-Time Communication**: WebSocket for live synchronization between players and the game server.

## Installation

### Prerequisites

- Node.js
- NPM (Node Package Manager)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/agkkaya321/unifrTB.git
   cd unifrTB
   ```
