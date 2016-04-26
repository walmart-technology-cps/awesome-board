# awesome-board
Digital solution for an Awesome Board a.k.a. Spotify Improvement Board a.k.a. Toyota Improvement Kata

## Quick Start
**The following instructions are intended to be executed via the terminal**
1. Make sure npm is installed
  1. We recommend using [homebrew](http://brew.sh/).
    * If you don't have homebrew already, you can install it using `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
    * Once homebrew is installed, install node and type `brew install node`
  1. To check if node was properly installed, type `node -v`. This will print the version in `v0.0.0` format
  1. To check if npm was properly installed, type `npm -v`. This will print the version in `0.0.0` format
  * **NOTE: If you already had homebrew and node installed, we recommend you ensure they are up-to-date**
    * `brew update`
    * `brew upgrade node`
1. Make sure mongodb is installed
  1. Again, we recommend homebrew - type `brew install mongodb` (or one of the other options [here](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/))
1. Clone the code to your workstation - `git clone https://github.com/walmart-technology-cps/awesome-board.git` - and cd into it - `cd awesome-board`
1. Make sure mongodb is running by typing `mongod &`
1. Type `npm install` - this will pull all of the dependencies found in the package.json file
1. Start the express server by typing `npm start`
  * The UI will be accessible via [http://localhost:3000/#/home.html](http://localhost:3000/#/home.html)

## ReST API
**The ReST API has been implemented thusly (accessible from root [http://localhost:3000/](http://localhost:3000/):**
* /teams
  * GET - JSON array of teams
      `[{"_id":"a1phanum3ric","name":"Team Name 1","__v":1,"boards":["a1phanum3ric"]},{"_id":"a1phanum3ric","name":"Team 2","__v":2,"boards":["a1phanum3ric","a1phanum3ric"]}]`
  * POST - Provide JSON for a single team
    * `{"name": "Required and Unique"}`
* /teams/:team
  * GET - JSON of a single specified team (or a 404 error if the provided ID does not map to a team)
    * `{"_id":"a1phanum3ric","name":"Team Name 2","__v":2,"boards":["a1phanum3ric","a1phanum3ric"]}`
    * Appending `/full` to the end of the URL will fully populate the boards under the team, including their states and achievements
  * PUT - JSON with new name
    * `{"name":"New Team Name"}`
  * DELETE - No JSON required, removes the provided team (along with any boards, states, and achievements under it)
* /teams/:team/boards
  * GET - JSON array of boards under the specified team
    * `[{"_id":"a1phanum3ric","team":"Team Name 1","name":"Board 1","__v":2,"currentState":"a1phanum3ric","targetState":"a1phanum3ric","awesomeState":"a1phanum3ric","achievements":["a1phanum3ric","a1phanum3ric"]},{"_id":"a1phanum3ric","team":"a1phanum3ric","name":"Board 2","__v":0,"achievements":[]}]`
  * POST - Provide JSON for a single board
    * `{"name": "Required and unique within a team"}`
* /teams/:team/boards/:board
  * GET - JSON of a single specified board (or a 404 error if the provided ID does not map to a board)
    * `{"_id":"a1phanum3ric","team":"a1phanum3ric","name":"Board 1","__v":2,"currentState":"a1phanum3ric","targetState":"a1phanum3ric","awesomeState":"a1phanum3ric","achievements":["a1phanum3ric","a1phanum3ric"]}`
    * Appending `/full` to the end of the URL will fully populate the states and achievements under the team
  * PUT - JSON with new name
    * `{"name":"New Board Name"}`
* /teams/:team/boards/:board/states
  * GET - JSON array of the states on the board (current, target, and awesome)
    * `[{"_id":"a1phanum3ric","title":"Current State","board":"a1phanum3ric","description":"Not Great","date":"2016-04-01T04:00:00.000Z","__v":0},{"_id":"a1phanum3ric","title":"Target State","board":"a1phanum3ric","description":"Better","date":"2016-08-01T03:59:59.000Z","__v":0},{"_id":"a1phanum3ric","title":"Definition of Awesome","board":"a1phanum3ric","description":"AWESOME!!!","__v":0}]`
* /teams/:team/boards/:board/currentState
  * GET - see /teams/:team/boards/:board/states/:state below
  * PUT - see /teams/:team/boards/:board/states/:state below
  * POST - Provide JSON for a single team
    * title and date are optional; if title is not provided, it will default to `"Current State"`
    * `{"description": "Not Great", "date": "1 Apr 2016"}`
* /teams/:team/boards/:board/targetState
  * GET - see /teams/:team/boards/:board/states/:state below
  * PUT - see /teams/:team/boards/:board/states/:state below
  * POST - Provide JSON for a single team
    * title and date are optional; if title is not provided, it will default to `"Target State"`
    * `{"description": "Better", "date": "31 July 2016 23:59:59"}`
* /teams/:team/boards/:board/awesomeState
  * GET - see /teams/:team/boards/:board/states/:state below
  * PUT - see /teams/:team/boards/:board/states/:state below
  * POST - Provide JSON for a single team
    * title and date are optional; if title is not provided, it will default to `"Target State"`
    * `{"description": "AWESOME!!!"}`
* /teams/:team/boards/:board/states/:state
  * GET - JSON of the requested state (404 if the state does not exist)
    * `{"_id":"a1phanum3ric","title":"Current State","board":"a1phanum3ric","description":"Not Great","date":"2016-04-01T04:00:00.000Z","__v":0}`
  * PUT - JSON with new title, description, and/or date (all optional not included is ignored)
    * `{"title":"New State Title", "description":"New State Description", "date":"May 1 2016 12:00:00"}`
* /teams/:team/boards/:board/achievements
  * GET - JSON array of the achievements on the board
    * `[{"_id":"a1phanum3ric","date":"2016-04-26T00:53:57.201Z","board":"a1phanum3ric","title":"Mike did a thing","description":"Digital Awesome Board","__v":0}]`
  * POST - Provide JSON for a single achievement
    * date is optional and will default to the timestamp that the POST request was received
    * `{"title":"Mike did a thing", "description":"Digital Awesome Board"}`
  * DELETE - No JSON required, removes all achievements on the board
* /teams/:team/boards/:board/achievements/:achievement
  * GET - JSON of the requested achievement (or a 404 error if the provided ID does not map to an achievement)
    * `{"_id":"a1phanum3ric","date":"2016-04-26T00:53:57.201Z","board":"a1phanum3ric","title":"Mike did a thing","description":"Digital Awesome Board","__v":0}`
  * PUT - JSON with new title, description, and/or date (all optional not included is ignored)
    * `{"title":"New Achievement Title", "description":"New Achievement Description", "date":"May 1 2016 12:00:00"}`
  * DELETE - No JSON required, removes the requested achievement