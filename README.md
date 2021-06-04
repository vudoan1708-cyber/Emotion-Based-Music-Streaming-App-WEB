# Technologies
This project makes use of 4 technologies: Vue.js, p5.js, D3.js and Node.js

# Use case

## Access to Platforms

### Spotify Access Token
Please refer to [Spotify Web API Reference Site](https://developer.spotify.com/documentation/web-api/) to get started 

### MongoDB Atlas
You will also need to create your database cluster in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Getting Started
There are 2 ways that you can run the code. 

### 1st Way
This way requires you to have two terminals to run your frontend and backend separately.

#### Frontend
Change your working directory on your 1st terminal to the frontend folder

##### Change Working Directory (Vue)
From the root directory, do
```
cd frontend
```

then do the first two of following steps to setup the project by installing all required dependencies for the frontend code and run Vue command line

##### Project setup (Vue)
```
npm install
```

##### Compiles and hot-reloads for development (Vue)
```
npm run serve
```

##### Compiles and minifies for production
```
npm run build
```

##### Lints and fixes files
```
npm run lint
```

##### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

#### Backend
On another terminal, you will need to, from the root folder, change your working directory into the backend folder

##### Change Working Directory (Node.js)
From the root directory, do
```
cd backend
```

then you will also need to setup the project by installing all required dependencies for the backend server and run it via the use of nodemon for hot-reload development

##### Project setup (Node.js)
```
npm install
```

##### Compiles and hot-reloads for development (Node.js)
```
npm run serve
```

### 2nd Way
Alternatively, this way only requires you to have one terminal to run your frontend and backend concurrently.

#### Concurrently NPM Package
This npm package is used to perform a concurrent execution for two or more entities efficiently.

##### Project setup (Concurrently)
Make sure that you have installed dependencies for both frontend and backend code before proceeding to the next steps below. Reference Project setup (Vue) and Project setup (Node.js)

##### Change Working Directory (Concurrently)
From the root directory, do
```
cd frontend
```

##### Concurrent Execution (Concurrently)
```
npm run dev
```

# TODO Lists
## Extended Features for Muserfly
### Mobile Responsive Design (DONE)
This will be developed for mobile users
### The Emotion Map: Zoom Feature (DONE)
This will be developed for mobile users
### The Emotion Map: Panning Feature (DONE)
This will be developed for mobile users
### Song Mapping on Locations: AR.js
Locations strongly correlate to Memories. And Memories bring back Emotions. What if you can use mixed reality technology to allow users to "plant" their playlist on a location and whenever they visit that physical location, they can see and play the playlist they listened to in the past?<br />
This will open up possibilities to create a music app where people will be able to listen to a playlist as they physically and virtually walk passed it, regardless of their "planted playlist" or someone else's 
