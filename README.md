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
1. Clone the code to your workstation
1. Make sure mongodb is running by typing `mongod &`
1. Type `npm install` - this will pull all of the dependencies found in the package.json file
1. Start the express server by typing `npm start`
  * The UI will be accessible via http://localhost:3000/#/home.html
