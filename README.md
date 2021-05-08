# Technologies
This project makes use of 3 technologies: Vue.js, p5.js and D3.js

# Use case
There are 2 ways that you can run the code. 

## 1st Step
This step requires you to have two terminals to run your frontend and backend separately.

### Frontend
Change your working directory on your 1st terminal to the frontend folder

#### Change Working Directory (Vue)
From the root directory, do
```
cd frontend
```

then do the first two of following steps to setup the project by installing all required dependencies for the frontend code and run Vue command line

#### Project setup (Vue)
```
npm install
```

#### Compiles and hot-reloads for development (Vue)
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Backend
On another terminal, you will need to, from the root folder, change your working directory into the backend folder

#### Change Working Directory (Node.js)
From the root directory, do
```
cd backend
```

then you will also need to setup the project by installing all required dependencies for the backend server and run it via the use of nodemon for hot-reload development

#### Project setup (Node.js)
```
npm install
```

#### Compiles and hot-reloads for development (Node.js)
```
npm run serve
```

## 2nd Step
Alternatively, this step only requires you to have one terminal to run your frontend and backend concurrently.

### Concurrently NPM Package
This npm package is used to perform a concurrent execution for two or more entities efficiently.

#### Change Working Directory (Concurrently)
From the root directory, do
```
cd frontend
```

#### Concurrent Execution (Concurrently)
```
npm run dev
```
