import React, { Component } from "react";
// import SpeakItOutContract from "./contracts/SpeakItOut.json";
// import getWeb3 from "./utils/getWeb3";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';



class DetailsPage extends Component {

    componentDidMount = async () => {
        let contract = this.props.contract;
        const count = await contract.methods.getBlogCount().call();
        console.log("Count of Blogs : " + count);
        var i = count - 1;
        this.setState({ blog: [] });
        while (i >= 0) {
            const response = await contract.methods.blogs(i).call();
            var new_array = this.state.blog.concat(response);
            this.setState({ blog: new_array });
            i--;
        }
        console.log("Sender :" + this.props.sender);
        const response = await contract.methods.profiles(this.props.sender).call();
        this.setState({ profile: response});
        console.log(response);

        let web3 = this.props.web3;
        const wei = await web3.eth.getBalance(this.props.sender);
        const balance =  await web3.utils.fromWei(wei,'ether');
        console.log(balance + " ETH"); 
        this.setState({ balance: balance});

        var accountNameMap = {};
        var accountNameArray = [];
        const member_count = await contract.methods.count().call();
        console.log("Accounts Length : " +member_count);

        for(var i = 0; i<member_count; i++){
            const accountInLoop = await contract.methods.members(i).call();
            console.log("Account loop : " +accountInLoop);
            const response = await contract.methods.profiles(accountInLoop).call();
            if(response.firstName!=""){
            accountNameMap[accountInLoop] = response.firstName + " "+response.lastName;
            accountNameArray.push(accountInLoop+";"+response.firstName + " "+response.lastName);
            }
        }
        this.setState({accountNameMap:accountNameMap});
        this.setState({accountNameArray:accountNameArray});

        console.log("Accounts added : "+accountNameMap[this.props.sender]);
        var messagesArray = [];
       this.setState({messagesArray:messagesArray});

    }

    updateStates = async () => {
        let contract = this.props.contract;
        const count = await contract.methods.getBlogCount().call();
        console.log("Count of Blogs : " + count);
        var i = count - 1;
        this.setState({ blog: [] });
        while (i >= 0) {
            const response = await contract.methods.blogs(i).call();
            var new_array = this.state.blog.concat(response);
            this.setState({ blog: new_array });
            i--;
        }
        console.log(this.props.sender);
        const response = await contract.methods.profiles(this.props.sender).call();
        this.setState({ profile: response});
        console.log(response);

        let web3 = this.props.web3;
        const wei = await web3.eth.getBalance(this.props.sender);
        const balance =  await web3.utils.fromWei(wei,'ether');
        console.log(balance + " ETH"); 
        this.setState({ balance: balance});
       
        var accountNameMap = {};
        var accountNameArray = [];
        const accounts = await web3.eth.getAccounts();
        for(var i = 0; i<accounts.length; i++){
            console.log("Account loop : " +accounts[i]);
            const response = await contract.methods.profiles(accounts[i]).call();
            if(response.firstName!=""){
            accountNameMap[accounts[i]] = response.firstName + " "+response.lastName;
            accountNameArray.push(accounts[i]+";"+response.firstName + " "+response.lastName);
            }
        }
        this.setState({accountNameMap:accountNameMap});
        this.setState({accountNameArray:accountNameArray});
    }

    getBlogs = async (e) => {

        console.log(this.state.blog);
    }

    addAccount = async (e) => {
        console.log("Clicked");
        let contract = this.props.contract;
        const response = await contract.methods.addAccount(this.fname.value, this.lname.value).send({
            from: this.props.sender, 
            gas: 3000000
        });
        console.log("Account Added");
        console.log(response);
        this.updateStates();
    }

  

    addBlog = async (e) => {
        let contract = this.props.contract;
        console.log(this.title.value)
        console.log(this.data.value)
        const response = await contract.methods.addBlog(this.title.value, this.data.value).send({
            from: this.props.sender,
            gas: 3000000
        });
        console.log("Blog Added");
        console.log(response);
        this.updateStates();

    }

   

    applaudBlog = async (author) => {
        let contract = this.props.contract;
        let web3 = this.props.web3;
        console.log(author);
        var value = '1';
        const response = await contract.methods.sendETH(author).send({
            from: this.props.sender,
            gas: 3000000,
            value: web3.utils.toWei( value, 'ether')
        });
        console.log("Applauded");
    }

    sendMessage = async () => {
        console.log("Sending Message");
        let contract = this.props.contract;
        console.log(this.address.value.split(";")[0]);
        const response = await contract.methods.sendMessage(this.address.value.split(";")[0], this.message.value,"0xF1C873793E4AED24EC7C7B63214C43429763252FB4FB4EE2F1AAC82D8808D905").send({
            from: this.props.sender,
            gas: 3000000
        });
        console.log("Message Sent");
        // this.updateStates();

    }

    getMessages = async () => {
        console.log("Getting Messages")
        let contract = this.props.contract;
        var messages = {};
        const events = await contract.getPastEvents('messageSentEvent',{filter:{from:this.props.sender,to:this.address.value.split(";")[0]},fromBlock:0,toBlock:'latest'});
        for(var i = 0;i< events.length;i++){
                console.log(events[i].returnValues.message)
                console.log(this.props.sender);

                messages[events[i].returnValues.msgCount] = this.state.accountNameMap[this.props.sender] + " : " + events[i].returnValues.message;
        }
        const events2 = await contract.getPastEvents('messageSentEvent',{filter:{from:this.address.value.split(";")[0],to:this.props.sender},fromBlock:0,toBlock:'latest'});
        for(var i = 0;i< events2.length;i++){
                console.log(events2[i].returnValues.message)
                messages[events2[i].returnValues.msgCount] = this.state.accountNameMap[this.address.value.split(";")[0]]+ " : " + events2[i].returnValues.message;

        }

            const ordered = {};
            Object.keys(messages).sort().forEach(function(key) {
              ordered[key] = messages[key];
            });
            console.log(JSON.stringify(ordered));
            this.setState({ messages:ordered});

            var messagesArray = [];
            Object.keys(ordered).forEach(function(key) {
                messagesArray.push(ordered[key]) 
              });
              this.setState({ messagesArray:messagesArray});

    }



        render() {
            console.log(this.props.navigate);
            if (this.props.navigate === "profile") {
                if(this.state.profile.firstName!=""){
                return (

                    <div>
                        <h1>Profile Data</h1>
                        
                                <Card border="primary" style={{ width: '40rem', alignContent: 'center' }}>
                                    <Card.Body>
                                        <Card.Title>Account Information</Card.Title>
                                        <Card.Text>
                                            <div>
                                            First Name : {this.state.profile.firstName}
                                            </div>
                                            <div>
                                            Last Name : {this.state.profile.lastName}
                                            </div>
                                            <div>
                                            Balance : {this.state.balance} ETH
                                            </div>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                      
                    </div>
                )
            }
            else{
                return(
                <div>
                <h1>Profile Data</h1>
                
                        <Form onSubmit={this.addAccount} style={{ width: '40rem' }}>
                            <Form.Group controlId="firstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control ref={input => this.fname = input} type="text" placeholder="Enter First Name" />
                            </Form.Group>
                            <Form.Group controlId="lastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control ref={input => this.lname = input} type="text" placeholder="Enter Last Name" />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
  </Button>
                        </Form>
              
            </div>)
            }
         } else if (this.props.navigate === "home") {
                return (<div>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous" />
                    <Card text="dark" className="bg-dark text-white ">
                        <Card.Img src={require('.././images/sky1.jpg')} alt="Card image" />
                        <Card.ImgOverlay>
                            <Card.Title><h1>Speak It Out</h1></Card.Title>
                            <Card.Text >
                            <h3>Freedom of speech is apparently a fundamental right but in today's centralized world, it is rarely implemented.
Large powerful organizations usually dictate what you can talk about.
Speak it out is a decentralized platformm for blogging which enforces the fundamental right of Freedom of Speech. It gives
you the power to talk about any topics and express your ideas.
And on top of it, Speak it out provides a secure messaging application so that you can share your thoughts with your 
fellow bloggers.</h3>

            </Card.Text>
                        </Card.ImgOverlay>
                    </Card>
                </div>)
            } else if (this.props.navigate === "blog") {
                this.getBlogs();

                return (
                    <div>

                        <Form onSubmit={this.addBlog} style={{ width: '80rem' }}>
                            <Form.Group controlId="formBasicTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control ref={input => this.title = input} type="text" placeholder="Enter Title" />
                            </Form.Group>

                            <Form.Group controlId="formBasicBlog">
                                <Form.Label>Blog</Form.Label>
                                <Form.Control ref={input => this.data = input} as="textarea" />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
  </Button>
                        </Form>
                        <ul  >
                            {this.state.blog.map(item => (
                                <Card bg="info" border="primary" style={{ width: '80rem', alignContent: 'center' }}>
                                    <Card.Img variant="top" src={require(".././images/sky1.jpg")} />
                                    <Card.Body>
                                        <Card.Title>{item.title}</Card.Title>
                                        <Card.Text>
                                            {item.data}
                                        </Card.Text>
                                        <Card.Text>
                                            <h1>Written By : {this.state.accountNameMap[item.author]}</h1>
                                        </Card.Text>
                                        <p>        {item.author} 
                                        </p>

                                        <Button variant="primary" onClick={() => this.applaudBlog(item.author)} >Applaud</Button>
                                    </Card.Body>
                                </Card>
                            ))}
                        </ul>
                    </div>)
            } else if (this.props.navigate === "chat") {
                return (

                    <div>
                        <Form onSubmit={this.getMessages} style={{ width: '40rem' }}>
                            <Form.Group controlId="formBasicTitle">
                                <Form.Label>Address</Form.Label>
                                <Form.Control ref={input => this.address = input} as="select" placeholder="Enter the public address of the user" >
                                {this.state.accountNameArray.map(fbb =>
      <option >{fbb}</option>
    )};
                                
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Fetch Messages
  </Button>

                            </Form>
                            <Card border="primary" style={{ width: '40rem', alignContent: 'center' }}>
                                    <Card.Body>
                                        <Card.Title>Messages</Card.Title>
                                        <ul  >
                            {this.state.messagesArray.map(item => (
                                <Card bg="info" border="primary" style={{ width: '40rem', alignContent: 'center' }}>
                                    <Card.Body>
                                        <Card.Text>
                                            {item}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                        </ul>
                                       
                                    </Card.Body>
                                </Card>
                            
                                <Form onSubmit={this.sendMessage} style={{ width: '40rem' , height: '70rem' }}>
                                        <Form.Group controlId="formBasicTitle">
                                            <Form.Label>Your Message</Form.Label>
                                            <Form.Control ref={input => this.message = input} type="text" placeholder="Enter your message here" >
                                            </Form.Control>
                                        </Form.Group>
                                        <Button variant="primary" type="submit">
                                Send New Message
                                        </Button>
                                        </Form>



                    </div>)
            }
            else {
                return (
                    <div />
                )
            }
        }
    }
    

    export default DetailsPage;
