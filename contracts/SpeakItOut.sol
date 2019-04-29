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
        address author;
        string authorName; 
    }

    mapping(address => ProfileDetails) public profiles;
    address[] public members; 

    Blog[] public blogs;
    uint public blogCount;
    uint public count;
    constructor() public{
        addBlog('HELLO','Hello is a song by British singer-songwriter Adele, released on 23 October 2015 by XL Recordings as the lead single from her third studio album, 25 2015. Adele co-wrote the song with her producer, Greg Kurstin. Hello is a piano ballad with soul influences, and lyrics that discuss themes of nostalgia and regret. Upon release, the song was acclaimed by music critics, who compared it favourably to Adeles previous work and praised the songs lyrics and Adeles vocals. It was recorded in Londons Metropolis Studios.');


    }

    uint msgCount = 0;
    event messageSentEvent(address indexed from, address indexed to, string message, bytes32 encryption,uint msgCount);




    //Add a new Account
    function addAccount(string memory firstName, string memory lastName) public{
        require(!profiles[msg.sender].isExists);

        ProfileDetails memory profileDetails = ProfileDetails(firstName,lastName,true);
        profiles[msg.sender] = profileDetails;
        members.push(msg.sender);
        count++;
    }

    

    function getCount() public view returns(uint){
      return count;
    }
    function addBlog(string memory title,string memory data) public {
        ProfileDetails memory profile = profiles[msg.sender];
        string memory author = profile.firstName;
        Blog memory blog = Blog(blogCount++,title,data,msg.sender,author);
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
