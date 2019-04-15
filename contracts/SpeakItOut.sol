pragma solidity ^0.5.0;

contract SpeakItOut {
        struct ProfileDetails {
        string firstName;
        string lastName;
        bool isExists;
    }


    struct Blog {
        uint id;
        string title;
        string data;
        // Number of users that upvoted
        uint upvotes;
        // User that upvoted the blog
        address[] users;
        address author;
        string authorName; 
    }

    mapping(address => ProfileDetails) public profiles;
    address[] public members; 

    Blog[] public blogs;
    uint public blogCount;
    uint public count;
    constructor() public{

    }

       uint msgCount = 0;
    event messageSentEvent(address indexed from, address indexed to, string message, bytes32 encryption,uint msgCount);




    //Add a new Account
    function addAccount(string memory firstName, string memory lastName) public{
        //Check if account already exists
        ProfileDetails memory profileDetails = ProfileDetails(firstName,lastName,true);
        profiles[msg.sender] = profileDetails;
        members.push(msg.sender);
        count++;
    }

    //Edit an Existing account
    function editAccount(string memory firstName, string memory lastName) public{
        //Check if account exists
        ProfileDetails memory profileDetails = ProfileDetails(firstName,lastName,true);
        profiles[msg.sender] = profileDetails;
    }

    function getCount() public view returns(uint){
      return count;
    }
    function addBlog(string memory title,string memory data) public {
        address[] memory users;
        ProfileDetails memory profile = profiles[msg.sender];
        string memory author = profile.firstName;
        Blog memory blog = Blog(blogCount++,title,data,0,users,msg.sender,author);
        blogs.push(blog);
        
    }
    function getBlogCount() public view returns(uint) {
        return blogs.length;
    }
    // function to send messages
    function sendMessage(address to, string memory message, bytes32 encryption) public {
        require(profiles[msg.sender].isExists);
        require(profiles[to].isExists);

        msgCount++;
        emit messageSentEvent(msg.sender, to, message, encryption, msgCount);
    }

    function sendETH(address payable rec) payable public {
        require(msg.sender.balance  > msg.value);
        rec.transfer(msg.value);

    }


}
