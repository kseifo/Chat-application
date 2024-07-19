# Chat application

A simple chat application that uses node, socket, and express to provide a real-time chatting experience.

## Installation

Steps required to setup the application:

```bash
# Clone the repository
git clone https://github.com/kseifo/Chat-application

# Navigate to the project directory
cd Chat-application

# Install dependencies
npm install sequelize
npm install express
npm install socket.io
npm install express-session
npm install bcrypt
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Additionally, you need an Apache and mySQL server running if you want to use this application.

## Usage

To run the application:

```bash
# Go to the root of the folder
cd Chat-application

# Compile typescript
tsc

# Execute the resulting build file
node build/startup/startup.js
```
