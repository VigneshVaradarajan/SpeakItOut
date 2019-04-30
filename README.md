
# Speak It Out - Blockchain Final Project

DApp for Blogging and Messaging

At this point, Ganache or any live network must be active.
Any network configuration can be provided in truffle-config.js

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

# Getting the UI Running

UI is developed using ReactJS
Go to client folder
```
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



