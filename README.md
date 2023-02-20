# Dude! AjanSeruanta Frontend
## About
This front end does not require to be ran in node so it can be built
Uses bootstrap 5.3 alpha for style

## TODO 
- [x] Major refactor
- [X] Fix Change password
- [/] Finnish 🇫🇮 Add Adam
- [X] Add are you sure when setting card what is is use
- [X] Set background to primary-subtle when card is in use
- [X] Make UserData load per page /api/v1/user/times/${id}
- [ ] Change colore in user table
- [ ] Export csv times table
- [ ] idk Some thing on main page
- [ ] Documentation
- [ ] Eggward 🥚
- [ ] Kinkku siukaleet
- [ ] Sipuli lastuja
- [ ] kermaa
- [ ] Beer 🍺
- [ ] Bread 🍞

## Setup
This project requires npm. Get npm from your favorite package manager.  
clone project using https
```sh
git clone https://github.com/LeadSeason/dude-worktime-frontend.git &&
cd dude-worktime-frontend/
```
or using ssh
```sh
git clone git@github.com:LeadSeason/dude-worktime-frontend.git &&
cd dude-worktime-frontend/
```
Now using npm install dependencies
```sh
npm install
```

## Development environment
To start a live Development environment
```
npm start
```
## Building
after setup you can build the project for production.
```sh
npm run build 
```
Build project is in the `dist/` directory
```
frontend
├── dist
│   │ - Built website for production
│   ├── admin
│   ├── cards
│   ├── login
│   └── users
│
├── node_modules
│    - Node modules folder
│   
└── src
    │ Source folder contains all code for the website
    ├── admin
    │    - Admin page.
    ├── assets
    │    - Assets images files. favicon.png
    ├── cards
    │    - Card page.
    ├── common
    │    - common html code. navbar.html
    ├── js
    │    - common javascript code. utils.js
    ├── login
    │    - Login page
    ├── sass
    │    - sass Style sheets
    └── users
         - Users page
```