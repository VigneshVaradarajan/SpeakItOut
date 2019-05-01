
# Speak It Out - Blockchain Final Project

DApp for Blogging and Messaging


# Install node.js
https://nodejs.org/en/download/


# Install truffle
```
> npm install truffle
```

Install and Create workspace in Ganache.  

# Install Ganache
https://truffleframework.com/ganache

At this point, Ganache or any live network must be active.
Any network configuration can be provided in truffle-config.js

It is important that Blockchain, Ganache and Metamask(Referenced in further steps) must all be running/referring in/to the same network.

```
  networks :{
    live: {
          host: "54.175.3.251",    
          port: 8545,            
          network_id: "*",       
         }
    }
};
```
# Compile and Deploy the contract

```
> truffle migrate --reset
```

--network must be provided for a network provided in truffle-config.js
```
> truffle migrate --reset --network live
```
# Metamask

At this point Metamask must be up and running
1. Install the chrome extension
 https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en
2. An account must be created
3. Make sure Metamask is connected to the same network as the blockchain running on Ganache.

# Getting the UI Running

UI is developed using ReactJS - 


# Install Pre-requisites for npm install

```
> npm install -g  windows-build-tools
```
Once build tools are installed, this includes python 2.7. Set python 2.7 path in npm config.

```
> npm config set python /path/to/executable/python2.7

```
Go to client folder and install npm modules

```
> cd client
> npm install
```
Start the UI
```
> npm start
```

Now once the UI has started, a dialog box from Metamask asking for handshake between the App and the Metamask has to accepted.

#Features of the Application

1. Profile - View/Add Profile Details
2. Blog - View/Add new Blog
3. Chat - Exchange chats between different profiles



