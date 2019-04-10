pragma solidity ^0.5.0;

contract SpeakItOut {
    struct ProfileDetails {
        string firstName;
        string lastName;
    }

    struct Blog {
        string title;
        string data;
        // List of users that upvoted
        string upvotes;
        // User that upvoted the blog
        address[] users;         
    }

    mapping(address => ProfileDetails) public profiles;

    uint count;
    constructor() public{

    }

    //Add a new Account
    function addAccount(string memory firstName, string memory lastName) public{
        //Check if account already exists
        ProfileDetails memory profileDetails = ProfileDetails(firstName,lastName);
        profiles[msg.sender] = profileDetails;
        count++;
    }

    //Edit an Existing account
    function editAccount(string memory firstName, string memory lastName) public{
        //Check if account exists
        ProfileDetails memory profileDetails = ProfileDetails(firstName,lastName);
        profiles[msg.sender] = profileDetails;
    }

    function getCount() public view returns(uint){
      return count;
    }
}
