# Installing and running (Windows)

1. Make sure you have git and node.js installed by using ```git --version``` and ```node -v```

    * More information: https://git-scm.com/downloads and https://nodejs.org/en/

2. Clone the repository ```git clone https://github.com/jerehuy/ar-platform-forcse-cct```
3. Install backend dependencies ```cd %path to project directory%/ar-platform-forcse-cct/backend``` and then ```npm install```
4. Install frontend dependencies ```cd %path to project directory%/ar-platform-forcse-cct/frontend``` and then ```npm install```
5. Now you can start the node server by changing directory to "backend/src" and by using ```nodemon server``` (restarts when changes occur) or ```node server```
6. Finally, you can run the app by opening another terminal and using command ```npm start``` while in "frontend" directory
