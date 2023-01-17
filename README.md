# Blog Website

This is a sample project done using nodejs , mongodb with express and handlebars.

---
## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v18.12.1

    $ npm --version
    8.19.2

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###
### Yarn installation
  After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

## Install

    $ git clone https://github.com/irfanrasheedkc/Blog-website.git
    
    $ cd Blog-website
    
    $ yarn install 
         or 
    $ npm install

## Add .env file
    
    Create a .env file in the current working directory.
    Open it with a text editor or in the vs code. 
    Add the following content:
      
      PORT = <PORT_NUMBER Eg:3000>
      dbname = <DATABASE_NAME>
      MONGO_USERNAME = <Mongo_Username>
      MONGO_PASSWORD = <Mongo_Password>
    
###### Note:
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) to get create an account on Mongodb cloud.

## Configure app

    $ code .
    This command opens the current folder in vs code.
  
## Running the project

    $ yarn start
        or 
    $ npm start
