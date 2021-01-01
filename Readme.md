# Upsilent Server 
Kuch acha caption sochenga 
## Installation 

Requires yarn and nodejs and aria2c on a server

### Installing aria2c 
Run the commands on a ubuntu >=18.04 server 
* `sudo apt-get update -y` this updates the repositories 
* `sudo apt-get install -y aria2` this installs aria2c 
* `tmux`  this opens us a separate bash window
* `sudo aria2c --enable-rpc --rpc-listen-all=true --rpc-allow-origin-all --seed-time=1` 
  * This starts up the aria2c which listens on port 6800
  * seed-time sets the time spend by the server in seeding to 1 Min you can set it to 0 to disable seeding
* Press *Ctrl + b*  then *d* (after releasing the Ctrl key 😑)  to detach the tmux session this keeps aria2 running in background
* You can connect back to the session by `tmux attach` and can again detach it by *Ctrl + b* and *d*


### Installing the server  
1. `yarn`  // install all dependencies
2. get google drive credentials.json [NodeJs Google Drive Quick start](https://developers.google.com/drive/api/v3/quickstart/nodejs)
3. make a .env file containing
   * *ARIA2C_URL* : hostname of the ari2c for example 127.0.0.1 if aria2c is running on the same host
   * *APP_PORT*   : the port at which the server will serve
   * *GDRIVE_UPLOAD_ROOT* : the id of the root folder to which the files are uploaded (more on this later)
4. To run the server `yarn run devStart`
5. On first run the server will display a GoogleOAuth link open that link in browser 
6. Authenticate the app then you will get a code paste that in terminal to continue 
7. Kill the server 
8. Open Google Drive from **the account** that authenticated the app in step 6
9. Create a folder to which the files will be uploaded and open it and get the folder id
   * The folder id is found at the end of the url when you open that folder in your browser 
   * For example in the folder  url `https://drive.google.com/drive/u/0/folders/1GraigcblA8c__oWPK42xZq1z1NbR3acd`
   * `1GraigcblA8c__oWPK42xZq1z1NbR3acd` is the id 
   * Assign the ID to *GDRIVE_UPLOAD_ROOT* in the `.env` file
10. That's just run the server as `yarn run devStart`

## Working 

As of now the project arch is a monolith. Under the hood it uses [aria2.js](https://github.com/sonnyp/aria2.js/)
to communicate with the aria2 over an WebSocket connection and exposes it through a rest API.
Next the [Google Drive V3 API](https://developers.google.com/drive/api/v3/about-sdk) is used for interfacing with the 
Google Drive Apis. 

## Problems
