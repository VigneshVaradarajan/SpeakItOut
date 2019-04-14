pragma solidity ^0.5.0;

contract SpeakItOut {
    struct ProfileDetails {
        string firstName;
        string lastName;
    }

    struct Blog {
        string title;
        string data;
        // Number of users that upvoted
        uint upvotes;
        // User that upvoted the blog
        address[] users;
        address author; 
    }

    mapping(address => ProfileDetails) public profiles;

    Blog[] public blogs;
    uint public count;
    constructor() public{

    }
    event messageSentEvent(address indexed from, address indexed to, string message, bytes32 encryption);
    event addContactEvent(address indexed from, address indexed to);
    event acceptContactEvent(address indexed from, address indexed to);
    event profileUpdateEvent(address indexed from, bytes32 name);
    event blockContactEvent(address indexed from, address indexed to);
    event unblockContactEvent(address indexed from, address indexed to);

    enum RelationshipType {NoRelation, Requested, Connected, Blocked}

    struct Member {
        bytes32 publicKeyLeft;
        bytes32 publicKeyRight;
        bytes32 name;
        bytes32 avatarUrl;
        uint messageStartBlock;
        bool isMember;
    }

    mapping (address => mapping (address => RelationshipType)) relationships;
    mapping (address => Member) public members;

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
    function addBlog(string memory title,string memory data) public {
        address[] memory users;
        Blog memory blog = Blog(title,data,0,users,msg.sender);
        blogs.push(blog);
        
    }
    function getBlogCount() public view returns(uint) {
        return blogs.length;
    }
        function addContact(address  addr) public onlyMember {
        require(relationships[msg.sender][addr] == RelationshipType.NoRelation);
        require(relationships[addr][msg.sender] == RelationshipType.NoRelation);

        relationships[msg.sender][addr] = RelationshipType.Requested;
        emit addContactEvent(msg.sender, addr);
    }

    function acceptContactRequest(address addr) public onlyMember {
        require(relationships[addr][msg.sender] == RelationshipType.Requested);

        relationships[msg.sender][addr] = RelationshipType.Connected;
        relationships[addr][msg.sender] = RelationshipType.Connected;

        emit acceptContactEvent(msg.sender, addr);
    }

    function join(bytes32 publicKeyLeft, bytes32 publicKeyRight) public {
        require(members[msg.sender].isMember == false);

        Member memory newMember = Member(publicKeyLeft, publicKeyRight, "", "", 0, true);
        members[msg.sender] = newMember;
    }

    function sendMessage(address to, string memory message, bytes32 encryption) public onlyMember isValid( to) {
        require(relationships[to][msg.sender] == RelationshipType.Connected);

        if (members[to].messageStartBlock == 0) {
            members[to].messageStartBlock = block.number;
        }

        emit messageSentEvent(msg.sender, to, message, encryption);
    }

    function blockMessagesFrom(address from) public onlyMember {
        require(relationships[msg.sender][from] == RelationshipType.Connected);

        relationships[msg.sender][from] = RelationshipType.Blocked;
        emit blockContactEvent(msg.sender, from);
    }

    function unblockMessagesFrom(address from) public onlyMember  {
        require(relationships[msg.sender][from] == RelationshipType.Blocked);

        relationships[msg.sender][from] = RelationshipType.Connected;
        emit unblockContactEvent(msg.sender, from);
    }

    function updateProfile(bytes32 name) public onlyMember {
        members[msg.sender].name = name;
        emit profileUpdateEvent(msg.sender, name);
    }

    modifier onlyMember() {
        require(members[msg.sender].isMember == true);
        _;
    }

    modifier isValid(address usr) {
        require(members[usr].isMember == true);
        _;
    }

    function getRelationWith(address a) public view onlyMember returns (RelationshipType) {
        return relationships[msg.sender][a];
    }
    function deleteProfile() public onlyMember{
        delete(members[msg.sender]);
    }

}
