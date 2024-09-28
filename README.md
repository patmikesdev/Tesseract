# Thesis Project, Patrick Mikes #885494

### (To View Rendered .md with funtional links in Visual Studio Code, please press shift+cmd+v) 

![Tesseract Brand](/clientBase/public/assets/screenShots/brand.png)

<h2 id="top">❖ Index</h2>

---
### ✧ [Intro](#intro)
### ✧ [Instructions for Setup/Use](#instructions-for-setup-and-use)
- ### Setup
    - [Important Note on integration with mongoDB][1]
    - [Installing Dependencies][2]
    - [Launching Server][3]
    - [Seed Database][4]
    - [Build Production bundle][5]
    - [View through dev Server][6]
- ### Use
    - [User/Social Activities][7]
        - [Registering as a new user][8]
        - [Logging in as a registered user][9]
        - [Editing profiles and accounts][10]
        - [Searching for other Users][11]
        - [Posting Comments][12]
    - [Game Activities][13]
        - [Inviting Another Player][14]
        - [Game Controls][15]

### ✧ [Original Thesis Research](#Thesis-Research)
- [Why WebSockets?][16]
- [Important Note on http/https][17]
- [Resources Used][18]
- [Integrating WebSockets with React][19]
- [State Management][20]
- [Signalling Pathways][21]

### ✧ Features carried over from Competency Project  
- ### Info on features from competency project work relocated to supplementaryReadMe markdown file. 
    -  [Automated DB Management][22]
    -  Express Sessions 
    -  User Authentication & Security 
    -  Mongoose Models 
    -  Customized Webpack dev server 
    -  Single Page Application
    -  React Context
        - Flash Messaging
        - Player Context
    -  React Suspense
    -  Theming  

### ✧ [Deferred Features](#deferred-features)  
### ✧ [Bug Reports](#bug-reports)  

---
## Intro
Welcome to Tesseract 2.0, a thesis project by Patrick Mikes. This project represents the culmination of everything I've learned during my time as a student with The Last Mile, and integrates original work from my capstone and competency projects, as well as a demonstration of self-directed learning and application of a complex topic beyond the scope of the core class curriculum. [Click here to read about my thesis research on webSockets](#Thesis-Research). Tesseract is a SPA (Single Page App) utilizing the full MERN stack. (MongoDB, Express, React, and NodeJS). This app has two primary components 
- A social media component, where players can
    - register new accounts
    - log in/out with using passwords which are encrypted before being stored in the app database. 
    - create and edit profiles,
    - post messages to profiles of other players 
    - edit their accounts,
    - search for other users who are currently online
- A multiplayer game component, where players can
    - Create a new game by choosing from a variety of settings, such as
        - Shape difficulty,
        - Grid Size
        - Speed
        - Player Color
    - Invite another player to join their game if they are also logged in
    - Accept or decline received invitations from other players.
    - Play together live in real time on their own devices, cooperating to earn points

#### ◎ Project Status
At the time of submission, this project should be considered as still under development, and there are a number of features scheduled for implementation in the near future. You can [read more here](#deferred-features)

---
## Instructions For Setup and Use
### <b>Setup</b>

 <h3 id="mongo-integration"> ◎ Important Note on integration with mongoDB </h3>
This project incorporates it's own custom manager to automate many of the processes involved with running and maintaining a mongodb server. You don't even need to launch a separate mongod daemon process.
Simply running npm start, in addition to launching the express app server listening at port `3000` (unless otherwise specified in `/serverBase/config/config.js`), will *ALSO* automatically launch a mongod process running in the background, listening on a port specified in config.js, and writing all log-data to a file under `./database/mongodLogs`.  
There is an entire utility written to automate many of the common db management properties which you can access by running: `npm run dbManager` or alternatively: `npm run dbm` for short.

You can read more about the automated DB Manager [below][22]

At Present, please rely primarily on using the dev database. If you forego using the built in command line tool for managing the database mentioned above, npm scripts start and seed both utilize the dev database as currently configured.

<h3 id='dependencies'>◎ Step 1: Installing Dependencies</h3> 
    1. Open a terminal in root directory
    2. cd /clientBase
    3. npm i
    4. cd ../serverBase
    5. npm i

<h3 id="server-launch">◎ Step 2: Launch Server</h3>
    With Terminal Open in directory /serverBase
    1. npm start

This also launches the mongod daemon process needed in step 3. 

<h3 id="seed-db">◎ Step 3: Seed Database</h3>
    With Terminal Open in directory /serverBase
    1. npm run seed

Part of the project requirements listed that this functionality be accessible through this npm script. However, it can also be executed as one of the functions of the automated [DB Manager Utility](#◎-Automated-DB-Manager)

<h3 id="build-bundle">◎ Step 4(A): Build Production Bundle and access through back end</h3>
The front end interface for this app will be accessible as a production-ready bundle that can be served over the same back-end express server handling all other requests. However, this must be built first, which can be accomplished by the following 
    
    With a Terminal open in directory /clientBase
    1. npm run build
    2. navigate to http://localhost:3000 in browser. (Or other port as specified in config.js, 3000 is default)

<h3 id="dev-server">◎ Step 4(B): Launch Front End Dev Server</h3>
This will launch a webpack development server listening @ port 2323, and automatically navigate to that address using your default web-browser.   
If for some reason, this does not automatically navigate to the app, you can do so manually by entering http://localhost:2323 into the url bar in your browser.   

    With Terminal open in directory /clientBase  
    1. npm start


[Back to Top][top]

---
### <b>Usage</b>
---

<h3 id="using-font-end">◎ Using The Front End</h3>
The Front End is designed to be as self-documenting as possible, and no one with basic experience using the internet should have difficulty utilizing the app.
#### To Register as a new User  
- From the home page, click on the button titled Sign Up. You should arrive at a screen that looks like the following.

    ![New User Sign Up](/clientBase/public/assets/screenShots/newUserForm.png)

Enter your information into the displayed form, including the upload of a photo. You can find several provided sample profile images to use (courtesy of Lightbox Images) in the folder `/clientBase/public/assets/sampleProfilePics`. After Submitting your form, you will be taken back to the home page where you can now log in using the email and password you just provided. 
#### Logging in as a pre-existing user   
The database is seeded with fake profiles for several famous scientists you can use to explore the app without creating your own profile. Their login information is as follows
- To Log in to Alan Turing's profile, use these credentials: 
    - email: aTuring@gmail.com
    - password: turing
- To Log in to Emmy Noether's profile, use these credentials: 
    - email: eNoether@gmail.com
    - password: noether
- To Log in to Albert Einstein's profile, use these credentials: 
    - email: aEinstein@gmail.com
    - password: einstein
- To Log in to Rosalind Franklin's profile, use these credentials: 
    - email: rFranklin@gmail.com
    - password: franklin

- #### Important note on demonstration of Multiple Logged In Users
    - In Production, this app is designed to utilize Express Sessions in order to persist a logged in user across browser refreshes. However, because this method relies on setting a browser cookie which is not unique to a specific browser tab, but is available to any browser tab visiting the same domain, an alternative workaround is implemented in this project to allow for demonstrating the multiplayer capabilities of the app. See the following code on lines 13-14 of `/clientBase/src/hooks/PlayerContext.jsx`
    ```js
    export default function playerContextProvider({ children }) {
        const allowMultiplePlayers = true;
    ```
    - Setting this variable as true disables some of the default session capability so that you can log in as a different users in different browser tabs. 
    - Alternatively, to simulate multiple users being logged in at one time without actually utilizing a distinct browser window, you can do the following:  
 
            With a terminal open in /serverBase, run command `npm run dbm`  
            Select dev db (Arrow keys + enter)  
            Select option 'Simulate Multiple User Logins' (arrow keys + enter)  
            Select which of the 6 default users you would like to have logged in (arrow keys, space bar to select, enter to proceed)  

    - Now, when you get to the user search feature, you will be able to see their status reflected as 'online'
#### Editing profiles and accounts   
- When you're logged in, a new item will appear in the top navbar allowing you to edit your profile and/or account information. 
    
    ![Editing Options](/clientBase/public/assets/screenShots/editingOptions.png)

    Whatever data you've previously provided will already be filled in to the form, so you can only change what things you need, and then submit. 
- The process for editing your account is very similar to editing your profile, only you will need to provide password confirmation before being permitted to save any changes. 
#### Searching for other Users
- This Process, while functional, is still somewhat rudimentary. The primary use case for this at present is to query the database, via the provided toggle filter, to see which users are currently online.

    ![Search Online Users](/clientBase/public/assets/screenShots/search.png)

For any text fields, you have to match values exactly as they are stored in the database, including case sensitivity. Making this feature more robust is one of the first updates scheduled when development time permits. At Present, you can however filter your query to see which users are currently online by using the provided toggle as well. 
#### Posting a comment to another profile
- Every users profile has a "comment wall" where you can leave a post if you wish. It will store the content of your message, and the date/time at which you posted it in the back end db. That post will then be viewable by anyone who also views that persons profile.

    ![Posting to profile wall](/clientBase/public/assets/screenShots/wallPost.png)

- You can only remove any comments that have been posted to the wall on your own profile, viewed as the home page when you're logged in. (Little boxes with x in them will faintly appear in the top right.)

[Back to Top][top]

<h3 id="game-activities">◎ Game Activities</h3>

#### Iniviting Another Player to Game
If another player is currently online, when you go to their profile page, you will see a button displayed underneath their name that says `invite to game`. 

![Invite to game button](/clientBase/public/assets/screenShots/inviteButton.png)

Pressing this will bring up a form where you can specify what settings you want to initialize your game. Available options inclue
- Shape difficulty,
- Grid Size
- Speed
- Your Player Color

Upon submitting, this form will then be sent to the player you're inviting. If they accept, they will be able to choose their own player color as well, so long as it is distinct from yours. 

![Game Settings Form](/clientBase/public/assets/screenShots/createGame.png)

[Back to Top][top]

#### Game Controls
The goal of the game is for you and your partner to play cooperatively to arrange the shapes as they fall so that every space in a horizontal layer is completely occupied by a block. While at the time of submission, the gameplay logic itself is not yet complete, this will be the way that players score points. When an entire layer is filled, all the blocks will be removed and any blocks in the layers above it will fall down until they can fall no further. 

To achieve this, you have two primary means of manipulating your shape. The default is called 'translation' and refers to the ability to move a shape in any of the four horizontal directions. This can be accomplished by pressing any of the corresponding arrow keys, or clicking/touching in the directional pad when it is in this mode

![Control Pad Translations](/clientBase/public/assets/screenShots/controlsTranslate.png)

The other mode is called 'rotation', and this refers to the ability to rotate your active shape clockwise/counterclockwise along all three axes. The 'center' of the shape, or rather the block around which the shape rotates, is called the keystone block and will have a gold outline to differentiate from all the other blocks in a shape. When in rotation mode, the control pad will look like this

![Control Pad Translations](/clientBase/public/assets/screenShots/controlsRotate.png)

There are also several option buttons located along the left hand side of the screen which you can activate by pressing the shift key, ctrl key, or the space-bar respectively. 

![Default Options Buttons](/clientBase/public/assets/screenShots/optionsDefault.png)

Pressing Shift (the top-most option button) toggles the Shape between rotation and translation mode. 

Pressing Space-bar (the bottom-most option button) while the gold/blue downwards arrow is showing will immediately drop your active shape as far down as it can go from it's current position. The other icon that appears (a shape behind a rope-line) will be to display the queue of the next three upcoming shapes. At the time of submission, that feature has not yet been implemented however. 

Pressing Control (the middle option button) has some special behavior called 'control frame mode' From the default settings, it pauses your shape from falling, and arrows will appear along the sides of the entire frame to indicate that you can now manipulate the frame to view it from a different perspective (say in the event you need to see an area that is blocked off from your current view by other shapes). The 'index block' will disappear from overlaying the control pad, and the frame will look like below. To unpause and resume controlling your active shape as opposed to the entire frame, press control again. Additionally, once this feature is implemented, pressing space-bar while in control frame mode will display a queue of the next three shapes that are going to appear in the game. 

Also if you notice the L/R/U/D graphic on the top of the frame, that is there to indicate the current orientation of your controls. EG, pressing up will translate/rotate your active shape in the direction indicated. If you change the perspective from which you view the frame, the directions will adjust accordingly so that L/R/U/D  are always defined with respect to the screen, not the frame itself. This makes for a *significantly* more intuitive experience of the controls and ultimately, a more enjoyable game. 

![Control Frame Mode](/clientBase/public/assets/screenShots/controlFrame.png)

---

## Thesis Research

### ◎ Why WebSockets? 
I chose to focus on WebSockets as the topic of my thesis because in order to take my game from it's original 1-player form to a true live action multiplayer game, I knew I was going to need a way to establish 2-way communication channels where my server could *also initiate* messages being sent to each client player, not just in response to a request. I briefly considered using Server Sent Events, but from information I gathered, WebSockets seemed to be the far superior option. This application, with it's 2-way communication demands, is precisely the sort for which WebSockets is designed. 

### ◎ Important Note on http/https
Normally, browsers restrict WebSocket connections to servers communicating over https. However, exceptions can be granted to a server running on the same local machine as the browser, as will be the case for both the grading and demonstration of this project. Still, as currently constructed, on initial launch of the application, users will likely be prompted with a warning regarding WebSocket connections over http. **They will have to tell their browser to grant the localhost permission to connect over this protocol.**   
In the future, it is my intent to further explore hosting my primary server using https. While in class, obviously that will be limmited to using a self-signed certificate, which would still prompt similar warnings from any browser. Furthermore, doing so adds the additional obstacle of how to integrate the https server and the WebSocket server with the webpack developmeent server. 

### ◎ Resources
There were some challenges around the availability of resources and tools from within the classroom. For instance, I didn't have access to the npm package `react-use-websocket` which was referenced frequently in some of the material I gathered. Nonetheless, I was able to rely on the following to accomplish what I needed for this project. 
- Chapter 15, section 11.3 of *JavaScript: The Definitive Guide* by David Flanagan, which dealt with WebSockets. 
- (The Last Mile) TLM Help Desk was able to provide me with a number of articles, guides, and pdfs, and I'd like to express my gratitude for their support. Two sources which were of particular use were
    1. The Complete guide to WebSockets with react, from https://ably.com/blog/websockets-react-tutorial. 
    2. The npm package 'ws', and it's associated README.md documentation. With this, I enabled my primary http server created with Express.js to pass 'upgrade' requests on to a coordinating WebSocket server. 

### ◎ Integration with React
The primary point of integration between the use of WebSockets and the larger body of my app occurs in a custom React Hook, `/clientBase/src/hooks/SocketHook.jsx`, which exported the hook under the name `useSocket()`. 
The idea is that any time a player logs in to my app, the app automatically establishes a WebSocket connection with my backend server. Having this connection in place even when the player was not involved in actual gameplay was necessary because it allowed me to notify a player when another sent them an invitation to a game, and it allowed them to accept/deny that invitation by sending their response back to the other player via their own WebSocket connection.

The actual socket itself was stored as `ws.current`, where ws was the result of a call to `useRef()`.

The primary pieces of state for dealing with a player's WebSocket connection are
- msg and setMsg  
```js
const [msg, setMsg] = useState().
//...
//...
    socket.onmessage = (evt) => {
        setMsg(JSON.parse(evt.data))
    }
```
An event listener is attached to the primary socket object itself for 'message' events. That event listener first automatically parses the incoming event data as JSON, and then triggers a call to setMsg. msg was then placed into context, and any component in the app that needed to respond to an incoming message could consume msg from the wrapping context provider, and 'listen' for changes to the state of msg via a useEffect() hook where msg was the dependency.
- send():
```js
    const send = useCallback((input) => {
        if (ws.current) {
            ws.current.send(JSON.stringify(input))
        }
    }, [ws.current])
```
This is a wrapper function around the default websocket method send(). It takes whatever JS object was passed as an argument and calls `JSON.stringify()` before sending it via the actual WebSocket. This allows me to avoid having to manually JSON stringify every individual call throughout the app. Also, by defining send() via useCallback(), and listing ws.current as a dependency, if the WebSocket connection ever breaks down and gets reestablished with a new socket, send is also redefined accordingly to use the current socket. send() was also placed into context, and so any component can consume it from the provider and use it to communicate with the server. 

### ◎ State Management
I faced a very difficult problem when it came to coordinating all the interactions between 
- the game data (which was placed into a separate context provider `GameContext.jsx`), 
- the player data and socket connection (from `PlayerContext.jsx`),
- and the event handling to parse commands input by a player.

The crux of the problem could be stated like this; my event handlers needed access to the most current values of certain pieces of state which were defined in context. But because of the way functions are scoped in JS, initially they were only accessing whatever values were in effect at the point when they were attached. I did *not* want to require detaching and re-registering the listeners every time a piece of state changed, as the state changes frequently during the course of a game. I also couldn't simply define the handlers in the same scope as the state because, since I had nested React Contexts, that kept giving me an error saying 
    
    Warning: Cannot update a component (`playerContextProvider`) while rendering a different component (`GameContextProvider`).

My solution was as follows.
1. In GameContext.jsx
    - myShape, theirShape declared as state w/ useState() hook, represent the active shape for each player. 
    - execCommand declared with a useCallback() hook, with myShape and theirShape listed as dependencies, so any time a new shape is made active, execCommand is redefined. 
    - `[controls, command] = useReducer(execCommand, defaultControls)`; 
    - command() is then placed into context and available for consumption. 
    - `Scaffold.jsx` then calls the custom hook useControls(); 
    - useControls() consumes command from GameContext, and the socket state [ready, msg, send] from PlayerContext, passes them as arguments to registerListeners(); 
    - registerListeners attaches the following to `keydown` events, where playerKeyed is the function that actually interprets the user input, but needs access to current state values from context;   
    `evt => command({evt, controller: playerKeyed})`
    - Because command() is the function returned from a useReducer() hook, it calls the original reducer function execCommand(). Since execCommand was itself returned from a useCallback() hook, it always has access to the correct current state values, and the ability to set new state values. The final steps are thus   
        - command calls `execCommand(oldState, {evt, controller: playerKeyed})`
        - execCommand returns the result of `playerKeyed(//necessary inputs)` which becomes the new current state value to controls; 
2. Shape Class
    - Abstracting the behavior needed for 'Shapes' (or game pieces) required they have access to another piece of state which was the array of blocks, initially all transparent comprising the actual DOM content of the 3-d framework of the game. (Just a whole bunch of `<div>`s!) As such, the state blocks[] could not be set until the DOM content had loaded.
    - So, I declared Shape via a useRef() hook.
    - Then in useControls(), with a useEffect() hook where blocks was a dependency, I called `Shape.current = buildShapeClass(blocks, send, ...etc)`, which returned the actual Shape class with the necessary state values bound via closure. 
    - Now instances of the Shape class could always access the current blocks[] and send() state values, and since myShape is an instance of this class, playerKeyed() can access myShape and have access to all the necessary up-to-date state values; 

### ◎ Signalling Pathways
The multiplayer mode of my game required a complex chain of coordinating signals used not only to implement actual game 'moves' or 'commands', but also to ensure all necessary content is loaded before commencing the game itself. For instance, an error would get thrown in the event one player received a signal from the server to move the other players shape (theirShape state value) *before* the player receiving that signal had actually loaded the shape itself. See Graphic below, with Setup Loops and signals for getNewShape, gotMine, and gotTheirs 

Likewise, it was important the app be able to handle temporary disruptions to socket connections. In that event, an interruption signal is sent to the player still connected, which pauses their game and displays a loading spinner, while the one whose socket broke automatically tries to reconnect every two seconds. This behavior can be simulated in development via an event listener I attached to deliberately close a players socket by pressing the 'x' key at any point. 

![Signalling Channels between Players and Server](/clientBase/public/assets/socketSignals.png). 

[Back to Top][top]

---

## Features carried over from Competency Project  

### ◎ Automated DB Manager
    To use the automated DB Manager, with a terminal open in directory /serverBase
    1. npm run dbm (alternatively, npm run dbManager)
    2. Select which db you want to access (Arrow keys + enter)
    3. Select which action you want to perform on that db (arrow keys + enter)
Below is a detailed breakdown of what the DB Manager does and how it works.

This custom utility has a number of features intended to streamline the integration of the mongoDB storage system with the rest of the app.
- Stores all required configuration data specified in a single file, `/serverBase/config/config.js`. (VERY HELPFUL) 
- App utilizes its own .mongo directory located in `/serverBase/database/.mongo`
- Upon launching the main back-end Express Server via command `npm start`, the app *automatically* launches a mongod daemon child process running in the background, connected as specified in config.js to be integrated with the entire app
- Keeps track of the mongod process id (pid). This allows the process to persist upon certain restarts of the express server. Say a signal from nodemon shuts down and restarts the server. The mongod process will not shut down and restart, but continue as normal. However, if the main server is manually shut down via ctrl-c, this will also simultaneously kill the mongod child process as well. So there is no need to open separate terminal windows. Graceful Shutdown function from `server.js`
```js
process.on('SIGINT', ()=> gracefulShutdown('SIGINT'))

//signal used by nodemon to trigger a restart of the server
process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'))


function gracefulShutdown(signal) {
    console.log('\n---- Starting ShutDown ----')
    disconnect()
    .then(() => {
        process.removeAllListeners()    
        if (signal === 'SIGINT') {
            if (daemon.startedByServer) killDaemon()
            else console.log(`---- mongodb Daemon was initially launched independent of server. ---- \n\t---- still running at pid: `, daemon.pid, ` ----`)
        }
        console.log('---- App Shutdown complete ----')
        queueMicrotask(process.exit)
    })
}
```
- All output of each mongod instance launched this way is written to a unique log file, stored under `/serverBase/database/mongodLogs`
- The DB manager can also do a lot more than just tie the mongod child process startup/shutdown to the express server. To view the possible options, with Terminal open in directory /serverBase, run command: `npm run dbManager` or, shorter version, `npm run dbm`. Then select which db you want to operate on (test/dev/production), at which point you can then   
    - Manually launch or kill a mongod process utilizing connection data in config.js independent of the express server. 
    - Check to see if there is a mongod process already running that is linked with the app
    - Launch a mongo shell to manually interact with the db
    - Clear all previous mongo log files
    - Seed Db using previously backed up data. 
    - Drop db
    - Create a backup seed by dumping db to file
    - Full Teardown and rebuild of initial seed using JS (useful for development)
    - Simulate logging in multiple different users to test App's search feature filtering users based on their status as logged in/out.
    - Logout all users who were 'logged in' using the immediately above utility. 

[Back to Top][top]


## Deferred Features
- Game Play Elements
    - Layer removal and scoring system (necessary beforeapp can be 'production-ready')
    - In depth tutorial explaining how to play the game
    - Block 'shadows' indicating where shape will fall from current position
    - Shape Queue to view next upcoming shapes. 
    - Improvements to latency experienced with current communication structure where server verifies validity of each move. 
    - Single Player Mode
- Social Media, user features
    - Adding friends
    - Enhance user Search capabilities
    - Append Comments to posts
    - Forgotten Password
- Back End, misc
    - Automated test suite
    - Persist Game Data in DB, allow players to return to a paused game. 
    - incorporate passport.js for user authentication via proxy
    - split each game into own child process, better handle high loads of server communication. 


[Back to Top][top]

---

## Bug Reporting
- Certain faces are getting erased at times once a block has already been locked in place; 
- Front End Shape.reject() got a "cannot read props of undefined, reading motion" error (so an id got rejected by the server, but couldn't be found in moves deque)
- certain games still not loading player 2's shape.. :/
- seems to be working great on large grid, but when I get to xl, gets a lot more laggy. EG when I make a bunch of moves, when the fall() comes from the server, it's triggering a lot of zigzaggy 

- Dropping some shapes not going all the way down. (think I fixed 12/12/23)
- Shape on Shape still an issue //fixed with extra call to testFall() in fall() method, not really efficient fix though, 12/12/23
- rare occasions arrows are disappearing completely from index cube, //happened when pausing from within rotateShape mode, fixed 12/12/23

[Back to Top][top]

---

[top]: #top  
[1]: #mongo-integration
[2]: #dependencies
[3]: #server-launch
[4]: #seed-db
[5]: #build-bundle
[6]: #dev-server
[7]: #using-front-end
[8]: #To-Register-as-a-new-User
[9]: #Logging-in-as-a-pre-existing-user
[10]: #Editing-profiles-and-accounts
[11]: #Searching-for-other-Users
[12]: #Posting-a-comment-to-another-profile
[13]: #game-activities
[14]: #Iniviting-Another-Player-to-Game
[15]: #Game-Controls
[16]: #◎-Why-WebSockets
[17]: #◎-Important-Note-on-http/https
[18]: #◎-Resources
[19]: #◎-Integration-with-React
[20]: #◎-State-Management
[21]: #◎-Signalling-Pathways
[22]: #◎-Automated-DB-Manager