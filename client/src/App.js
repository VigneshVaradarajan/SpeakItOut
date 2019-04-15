import React, { Component } from "react";
import SpeakItOutContract from "./contracts/SpeakItOut.json";
import getWeb3 from "./utils/getWeb3";
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import DetailsPage from './components/DetailsPage';

import "./App.css";

class App extends Component {
  state = { profileCount: 0, web3: null, accounts: null, contract: null, navigate: "home" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log("Accounts Length App : " +accounts);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SpeakItOutContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SpeakItOutContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };



  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    const response = await contract.methods.count().call();
    console.log(response.toNumber());



    

    // // Update state with the result.
    this.setState({ profileCount: response.toNumber(), sender:accounts[0] });

    console.log(this.state.sender);
    const profileData = await contract.methods.profiles(this.state.sender).call();
    this.setState({ firstName: profileData.firstName, lastName: profileData.lastName});
    console.log(response);
  };

  setToBlogPage =  () => {
    this.setState({ navigate: "blog"});
    console.log("Page State is set to blog");
  }
  setToChatPage =  () => {
    this.setState({ navigate: "chat"});
    console.log("Page State is set to chat");
  }
  setToProfilePage =  () => {
    this.setState({ navigate: "profile"});
    console.log("Page State is set to blog");
  }
  setToHomePage =  () => {
    this.setState({ navigate: "home"});
    console.log("Page State is set to home");
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
            <link  rel="stylesheet"  href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"  integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"/>
<Navbar bg="light" expand="lg">
  <Navbar.Brand href="#home" onClick={this.setToHomePage}>Speak It Out</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="#blog" onClick={this.setToBlogPage}>Blog</Nav.Link>
      <Nav.Link href="#chat" onClick={this.setToChatPage}>Chat</Nav.Link>
      <Nav.Link href="#profile" onClick={this.setToProfilePage}>Profile </Nav.Link>
    </Nav>
    <Nav>
    <Nav>
      <Nav.Link href="#profile"  onClick={this.setToProfilePage}> {this.state.firstName} {this.state.lastName}</Nav.Link>
    </Nav>
    </Nav>
    
  </Navbar.Collapse>
</Navbar> 
<DetailsPage navigate ={this.state.navigate} web3={this.state.web3} contract={this.state.contract} sender={this.state.sender}/>

      </div>
    );
  }
}

export default App;
