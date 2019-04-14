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
        console.log(this.props.sender);
        const response = await contract.methods.profiles(this.props.sender).call();
        this.setState({ profile: response});
        console.log(response);
    }

    getBlogs = async (e) => {

        console.log(this.state.blog);
    }

    addAccount = async (e) => {
        console.log("Clicked");
        let contract = this.props.contract;
        const response = await contract.methods.addAccount("Vignesh", "Varadarajan").call();
        console.log("Account Added");
        console.log(response);
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

    }

    getChatDetails = async (e) => {
        let contract = this.props.contract;
        console.log(this.address.value)
        //  const response = await contract.methods.addBlog(this.title.value,this.data.value).send({
        //   from: this.props.sender,
        //   gas: 3000000 
        // });
        //  console.log("Blog Added");
        //  console.log(response);

         }


        render() {
            console.log(this.props.navigate);
            if (this.props.navigate === "profile") {
                return (

                    <div>
                        <h1>Profile Data</h1>
                        
                                <Card border="primary" style={{ width: '40rem', alignContent: 'center' }}>
                                    <Card.Body>
                                        <Card.Title>Account Information</Card.Title>
                                        <Card.Text>
                                            First Name : {this.state.profile.firstName}
                                            Last Name : {this.state.profile.lastName}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                      
                    </div>
                )
            } else if (this.props.navigate === "home") {
                return (<div>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous" />
                    <Card className="bg-dark text-white ">
                        <Card.Img src={require('.././images/sky1.jpg')} alt="Card image" />
                        <Card.ImgOverlay>
                            <Card.Title>Card title</Card.Title>
                            <Card.Text>
                                This is a wider card with supporting text below as a natural lead-in to
                                additional content. This content is a little bit longer.
            </Card.Text>
                            <Card.Text>Last updated 3 mins ago</Card.Text>
                        </Card.ImgOverlay>
                    </Card>
                </div>)
            } else if (this.props.navigate === "blog") {
                this.getBlogs();

                return (
                    <div>

                        <Form onSubmit={this.addBlog} style={{ width: '40rem' }}>
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
                                <Card border="primary" style={{ width: '40rem', alignContent: 'center' }}>
                                    <Card.Img variant="top" src={require(".././images/sky1.jpg")} />
                                    <Card.Body>
                                        <Card.Title>{item.title}</Card.Title>
                                        <Card.Text>
                                            {item.data}
                                        </Card.Text>
                                        <Button variant="primary">Go somewhere</Button>
                                    </Card.Body>
                                </Card>
                            ))}
                        </ul>
                    </div>)
            } else if (this.props.navigate === "chat") {
                return (

                    <div>
                        <Form onSubmit={this.getChatDetails} style={{ width: '40rem' }}>
                            <Form.Group controlId="formBasicTitle">
                                <Form.Label>Address</Form.Label>
                                <Form.Control ref={input => this.address = input} type="text" placeholder="Enter Address" />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
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
