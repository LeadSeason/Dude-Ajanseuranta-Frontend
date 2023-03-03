# Dude! AjanSeruanta Frontend
## About
This front end does not require to be ran in node so it can be built.  
Uses bootstrap 5.3 alpha for style

## TODO 
- [ ] Have minimum length requirements for names
- [ ] *CRITICAL* Fix potential xxs exploits. example user's and cards are interpreted as html code and not text
- [ ] In card rename. rename with enter
- [ ] Export csv times table (maybe)
- [ ] Documentation
- [x] Major refactor
- [X] Fix Change password
- [X] Finnish 🇫🇮 Add Adam
- [X] Add are you sure when setting card what is is use
- [X] Set background to primary-subtle when card is in use
- [X] Make UserData load per page /api/v1/user/times/${id}
- [X] Make better name and card name in user week list
- [X] Change color in user table
- [X] idk Some thing on main page

## Issues
- Main page on development site has syntax error caused by loading index.js but contains index.html data. 


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
│   ├── user
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
    ├── user
    │    - Detailed time for user status page.
    └── users
         - List of users page.
```

## License
<p align="center">
  <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPL-3.0</a>
  <br>
  <img href="https://www.gnu.org/licenses/gpl-3.0.en.html" src="https://www.gnu.org/graphics/gplv3-127x51.png">
</p>

