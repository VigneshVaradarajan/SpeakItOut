import React, { Component } from "react";
// import SpeakItOutContract from "./contracts/SpeakItOut.json";
// import getWeb3 from "./utils/getWeb3";


class Profile extends Component {
    componentDidMount = async () => {
        this.getProfileData();
    }
    addAccount = async(e) => {
        console.log("Clicked");
        let contract = this.props.contract;
        const response = await contract.methods.addAccount("Vignesh","Varadarajan").call();
        console.log("Account Added");
        console.log(response);
    }

    getProfileData = async(e) => {
        let contract = this.props.contract;
        let sender = this.props.sender;
        console.log(sender);
        const response = await contract.methods.profiles(sender).call();
        console.log(response); 
    }

  render() {
      return ( 
          <div>
              <h1>Profile Data</h1>
              <button onClick={this.addAccount}>
                    Add Account
                </button>
          </div>
      )
  }
}

export default Profile;
