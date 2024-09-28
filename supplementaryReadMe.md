## Supplementary README.md

Because this project represented a continutation of work that was done for my competency project, I thought it might be useful to include some of the material from that projects README.md file here as well. These topics are all still present in the app itself, and so it might be helpful to have available. But since it doesn't represent new work, I abstracted it out from the primary README and relocated it here. 

### ◎ Express Sessions

This app uses the npm package express sessions to keep track of what user is currently logged in via the browser. 
- However, without access to any of the supplementary 'memory store' packages available to the general public via npm, I had to resort to creating my own.
- Fortunately, express sessions does provide an abstract base class `Store`, so I was able to extend that to achiece the functionality desired. 
- Integrated with a mongoose Model
- From `/serverBase/database/utils/sessionStore.js`
```js
import { Store } from 'express-session'
import SessionStore from '#sessionModel'

export class MongooseStore extends Store{
    constructor() {
        super()
    }
    //IMPLEMENTED ABSTRACT METHODS LIKE GET, SET etc.....
```
- Even if the server restarts, the session data will still be available upon restarting

### ◎ User Authentication and Security
Some Care was taken when it comes to storage of any user passwords
- No user Password is stored in an unencrypted form anywhere on the server. (With the exclusion of the sample profiles)
- Before any account is created, it uses a mongoose hook to encrypt the provided string by
    1. concatenating a random 'salt' string to the end, 
    2. passing the resulting string through a hash function
- It is this password Hash and Salt that are actually stored in the db.
- Then When a user Tries to log in
    1. Their email address is used to fetch the salt string and password Hash stored with their account
    2. That salt is appended to whatever string was input as the attempted password
    3. The same hash function is applied to the input + salt and then compared against the stored hash. 
    4. If it matches, then the user can successfully login and be serialized to a session. 
- From `/serverBase/models/account.js`
```js
accountSchema.pre('validate', function (next) {
    if (this.isNew || this.isModified('passwordHash')) {
        this.salt = randomBytes(12, (err, buf) => {
            if (err) throw err;
            this.salt = buf.toString('hex');
            this.passwordHash = createHash('sha512')
                .update(this.salt + this.passwordHash, 'utf8')
                .digest('hex')
            next()
        })
    }
    //...
```
---

## Front End Features

### ◎ Webpack Dev Server 
This project did *NOT* utilize the react-scripts package, but rather has a custom configured webpack dev server. You can view the configuration file at `/clientBase/webpack.config.js.  
This approach allowed for more fine grained control over things like proxying requests from the dev server to the back-end express server, lazy-loading with use/unuse of .lazy.css files, customizing the template html file from which to start the build process, etc. 


### ◎ SPA
This project is a true Single Page Application, that can deliver all its static assets in a single bundle, built with webpack.  
React Router
- It utilizes the React Router to simulate a more traditional navigation experience when using the app, but entire pages are not being fetched from the server, only whatever data is required to render the React JSX. 
- React Router also takes cares of updating the location displayed in the URL bar in the broswer window. This allows anyone to directly navigate to or bookmark any specific 'page'  

From `/clientBase/src/index.jsx`
```jsx
import { Route, Routes, BrowserRouter} from "react-router-dom";
const root = createRoot(document.getElementById('root'))
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route element={<Layout />}>
                    <Route element={<TwoColLayout />}>
                        <Route index element={<Home />} />
                        <Route path="login" element={<LogIn />} />
                        <Route path="register" element={<Register />}/>
                        <Route path="editMyProfile" element={<ProfileEditor id="hello"/>}/>
                        <Route path="editMyAccount" element={<AccountEditor id="accountForm"/>}/>
                    </Route>
                    <Route path=":userName" element={<AlternateProfile />}/>
                    <Route path="/searchUsers" element={<UserSearch />}/>
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
)
```

### React Context
### ◎ Flash Messaging
With the help of React Context and a custom hook, displaying messages to users of this app for things like errors or requestion confirmation is extremely simple.
- `/clientBase/src/hooks/FlashMsgContext.jsx` places the props used by the modal (show vs. hide, message, icons, behavior etc) *AND* the function for setting (returned via a useReducer() call) into context
- It also exports a custom hook called useFlashMsgContext that allows any nested component to become a 'consumer' of this context
- The component `/clientBase/src/components/Modals/FlashMsgModal` is one consumer of this context (via useFlashMsgContext() hook), and uses the prop values when rendering what actually appears in the modal
- Any other component can also consume this context (via useFlashMsgContext() hook) which exposes the function setModalProps. So for instance, if a component sent a fetch request that came back with an error, it can use setModalProps to change the showing state of the modal, and relay the error message to the user in doing so. It is used in a variety of different situations around the app for this purpose. For instance, it's used to request confirmation before deleting a post from your profile wall. 

### ◎ Player Context
There is also a custom hook that follows a similar process as the Flash Messaging for passing the information of the currently logged between components
-  `/clientBase/src/hooks/PlayerContext.jsx` places the pieces of state reflecting the data of the currently logged in user, which are used by various components in rendering *AND* the function for setting (returned via a useState() call) into context.
- It also exports a custom hook called usePlayerContext that allows any nested component to become a 'consumer' of this context
- Any other component can then consume this context (via usePlayerContext() hook) which also exposes the function setPlayer.  
Note, at some point in the future, this is likely to be upgraded by switching the state management from a simple useState() to a more robust useReducer() like in the Flash Messaging. 


### ◎ React Suspense
This app utilizes two different React Suspense components to handle those periods during which the data required for rendering is in a pending state (such as being fetched from the server). Because this project is primarily viewed over the same machine hosting the server at this stage, I actually implemented 3 second delays before resolving the promise returned from the original fetch request. During These delays, you can then see the custom Spinner component that each Suspense Component renders when a promise is thrown. (It is a rotating cube, with individually rotating waiting icons). There is one that's rendered when a user first logs in, and one that's rendered when the user performs a search, that simulates waiting for the results of the query to come back from the server.  
From `/clientBase/src/components/UserSearch.jsx`
```js
    setResults(
        fetch('/api/user/searchUsers', {
            method: "POST",
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify(totalQuery)
        })
        .then(r => r.json())
            .then(r => {
            //this version simulates spinner behavior by leaving results in pending promise state for 4 seconds
            setTimeout(() => setResults(r.data), 4000)    
            //this fulfills as soon as results come back    
            // setResults(r.data)
        })
```

### ◎ Custom Themes
The app also allows for users to choose between 1 of four color themes: 
- Default(blue)
- Green
- Violet
- Charcoal
As part of the Player Context, a different CSS File, defining the values of css variables like `--btn-default` are lazily loaded and unloaded whenever the user edits their profile. Changing the values of these variables in one spot changes the styles for every element that uses them. This makes adding a new theme as easy as creating a .lazy.css file that defines a new set of values for these variables.   
Lazy loading these css styles like this was accomplished by setting the following rule as part of the file `/clientBase/webpack.config.js`
```js
    {
        test: /\.lazy\.css$/i,
        use: [
            { loader: "style-loader", options: { injectType: "lazyStyleTag" } },
            { loader: "css-loader", options: { modules: "global" } },
        ],
    }
```
And then, the custom hook usePlayerContext() 
- Creates state for managing the applied theme via a useReducer() hook call, 
- places the function returned from this labelled setTheme into the player context
From `/clientBase/src/hooks/PlayerContext.jsx`
```js
import greenTheme from '../themes/greenTheme.lazy.css'
//.... etc other themes,

export default function playerContextProvider({ children }) {
    //...
    const [theme, setTheme] = useReducer(themeReducer, defaultTheme); 

    function themeReducer(oldTheme, newThemeName) {
        const themes = {
            default: defaultTheme,
            green: greenTheme,
            violet: violetTheme,
            charcoal: charcoalTheme,
        }
        let newTheme = themes[newThemeName]
        oldTheme.unuse(); 
        newTheme.use()
        return newTheme; 
    }
    //...
```

---