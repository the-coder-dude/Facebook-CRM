import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

let history = createBrowserHistory();
let self;
class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: ""
        }
        self = this;
    }

    responseFacebook = (response) => {
        let username;
        if (response.email){
            username = response.email
        } else {
            username = response.name
        }
        let data = {
            name: response.name,
            profile_picture: response.picture.data.url,
            username: username,
            social_signin: {
                name: 'facebook',
                id: response.id
            }
        }

        self.createUserOrLoggedIn(data, 'facebook');
    }

    componentDidMount(){
        console.log('login...', this.props.social_id)
    }

    handleChange(e){
        let {name, value} = e.target
        if (name === "username"){
            self.setState({
                username: value
            })
        } else {
            self.setState({
                password: value
            })
        }
    }

    createUserOrLoggedIn(data, strategy) {
        axios.post("/auth/social_sigin", data)
            .then(res => {
                if(res.status === 200){
                    if (res.data.code === 208){
                        console.log(res.data)
                    } else {
                        console.log(res.data)
                    }
                    history.push({
                        pathname: '/profile',
                        state: {id: res.data.data.social_signin.id}
                    });
                    history.go('/profile');
                } else {
                    console.log(res)
                }
            })
    }

    signup(){
        history.push('/signup');
        history.go('/signup');
    }

    login(){
        if (self.state.password === "" || self.state.username === ""){
            alert('please fill all the fields')
        } else{
            let data = {
                "username": self.state.username,
                "password": self.state.password
            }
            axios.post('/auth/login', data)
                .then(res => {
                    if (res.data.code === 200){
                        history.push({
                            pathname: '/profile',
                            state: {username: self.state.username}
                        });
                        history.go('/profile');
                    } else {
                        alert('do not have account')
                    }
                })
        }
    }

    render(){
        console.log('render...', this.props.social_id)
        return(
            <div className="row" style={{ padding: "10px 0"}}>
                <div className="col-md-4"></div>
                <div className="col-md-4">
                    <div className="login-page">
                        <div className="row signIn-text">
                            <div className="col-md-12">
                                <h1>Welcome</h1>
                            </div>
                        </div>
                        
                        <div className="col-md-12 social-media-icons">
                            <div className="row">
                                <div className="col-md-12">
                                    <h2>Welcome to RichPanel</h2>
                                    <h3>Please Login with Facebook</h3>
                                </div>
                                <div className="col-md-12">
                                    <FacebookLogin
                                        appId= {process.env.FB_AppID}
                                        autoLoad={true}
                                        fields="name,email,picture"
                                        render={renderProps => (
                                            <button className="loginBtn loginBtn--facebook" onClick={renderProps.onClick}>
                                                Login with Facebook
                                            </button>
                                        )}
                                        callback={self.responseFacebook} 
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        social_id: state.socialIdReducer.socialId
    }
}

export default connect(mapStateToProps, actions)(Login);