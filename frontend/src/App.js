import React from 'react';
import logo from './logo.svg';
import './App.css';
import {socketConnect} from 'socket.io-react';


const initialState = {
    messages: [],
    username: '',
    usernameExists: false,
    formUsername: '',
    formContent: ''
};

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = initialState;

        this.addMessage = this.addMessage.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangeContent = this.handleChangeContent.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.handleSetUsernameFormSubmit = this.handleSetUsernameFormSubmit.bind(this);
        this.handleChangeUsernameButton = this.handleChangeUsernameButton.bind(this);
    }

    componentDidMount() {

        const username = localStorage.getItem('username');
        if (!username) {
            this.setState({usernameExists: false});
        } else {
            this.setState({usernameExists: true, username: username});
        }

        this.props.socket.on('chat messages', msg => {
            this.setState({messages: msg.data});
        });
        this.props.socket.on("chat message", msg => {
            const {username, content} = msg.data;
            this.setState({
                messages: [{username, content}, ...this.state.messages]
            });
        })
    }

    addMessage() {
        this.props.socket.emit('chat message', {username: 'test', content: '123'});
    }

    handleChangeUsername(e) {
        this.setState({
            formUsername: e.target.value
        });
    }

    handleChangeContent(e) {
        this.setState({
            formContent: e.target.value
        })
    }

    handleSubmitForm(e) {
        e.preventDefault();
        this.props.socket.emit("chat message", {username: this.state.username, content: this.state.formContent});
    }

    handleSetUsernameFormSubmit(e) {
        e.preventDefault();
        localStorage.setItem('username', this.state.formUsername);
        this.setState({usernameExists: true, username: this.state.formUsername});
    }

    renderSetUsernameForm() {
        return (
            <div className="username_set__box">
                <form onSubmit={this.handleSetUsernameFormSubmit}>
                    <label>Podaj nick: </label>
                    <input type="text" name="username" required onChange={e => this.handleChangeUsername(e)}/>
                    <button type="submit">Zapisz</button>
                </form>
            </div>
        )
    }

    renderMessages() {
        return (this.state.messages.map((message) =>
            <div className="chat__message">
                <div className="chat__message__username">
                    {message.username}
                </div>
                <div className="chat__message__content">
                    {message.content}
                </div>
            </div>
        ));
    }

    handleChangeUsernameButton() {
        this.setState({
            usernameExists: false,
            username: ''
        });

        localStorage.removeItem('username');
    }

    renderChat() {
        const messages = this.renderMessages();
        return (
            <>
                <h1>Czat</h1>
                <div className="chat__box">
                    <div className="chat__messages">
                        {messages}
                    </div>
                    <form onSubmit={this.handleSubmitForm}>

                        <label>Wiadomosc: </label>
                        <textarea name="content" onChange={e => this.handleChangeContent(e)} required/>
                        <button type="submit">Wyslij</button>
                    </form>
                    <div style={{textAlign: 'center'}}>
                        <button onClick={this.handleChangeUsernameButton}>Zmień nick</button>
                    </div>
                </div>
            </>
        )
    }

    render() {
        const display = this.state.usernameExists ? this.renderChat() : this.renderSetUsernameForm();
        return (
            <main>
                {display}
                <footer>
                    <p>Wykonał: Adrian Ciołek</p>
                </footer>
            </main>
        );
    }
}


export default socketConnect(App);
