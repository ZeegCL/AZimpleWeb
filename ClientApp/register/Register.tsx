import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import axios from 'axios';

interface RegisterFormState {
    account: {
        Username: string;
        Email: string;
        Password: string;
    };
    errors: {
        Username: string;
        Email: string;
        Password: string;
    };
    submitted: boolean;
    result: string;
}

export class Register extends React.Component<RouteComponentProps<{}>, RegisterFormState> {
    constructor() {
        super();
        this.state = { 
            account: { Username: '', Email: '', Password: '' },
            errors: { Username: '', Email: '', Password: '' },
            submitted: false,
            result: ''
        };

        this.validateInput = this.validateInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    private async validateInput(event: any) {
        const { name } = event.target;
        let { value } = event.target;
        let error = '';

        if (name === 'Username') {
            value = value.replace(/[\W_]/g, '');

            if (value.length == 0) {
                error = 'Username is a required field.'
            } else if (value.length > 20) {
                error = "Username can't be longer than 20 characters.";
            }

            this.usernameExists(value);
        }

        if (name === 'Email') {
            if (value.length == 0) {
                error = 'Email is a required field.';
            } else {
                let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
                let matches = pattern.test(value);
                if (!matches) {
                    error = "The email you entered doesn't have a valid format.";
                }
            }
        }

        if (name === 'Password') {
            if (value.length == 0) { 
                error = 'Password is a required field.';
            } else if (value.length < 6) {
                error = 'Your password must be at least 6 characters long';
            } else if (value.length > 10) {
                error = "Your password shouldn't be longer than 10 characters";
            } else {
                let pattern = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g;
                let matches = pattern.test(value); 
                if (!matches) {
                    error = 'Your password must contain lower and upper case letters, numbers and symbols.';
                }
            }
        }

        this.setState({
            ...this.state,
            errors: { ...this.state.errors, [name]: error },
            account: { ...this.state.account, [name]: value }
        });
    }

    private usernameExists(username: string) {
        axios.get(`/api/Account/${username}`)
            .then(response => {
                this.setState({ ...this.state, errors: { ...this.state.errors, Username: 'Username already exists.' } })
            })
            .catch(error => {

            });
    }

    private handleChange(event: any) {
        const { name, value } = event.target;

        this.setState({ ...this.state, account: { ...this.state.account, [name]: value } });
    }

    private handleSubmit(event: any) {
        event.preventDefault();
        this.setState({
            ...this.state,
            submitted: true,
            result: ''
        });

        axios.post('/api/Account/Register', { ...this.state.account })
            .then((response) => {
                console.log(response);
                this.setState({
                    ...this.state,
                    result: response.data,
                    account: { Username: '', Email: '', Password: '' }
                });
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    ...this.state,
                    result: error.response.data
                });
            });
    }

    public render() {
        return <section>
            
            <h2>Register</h2>
            <div className='container'>
                <div className='6u'>
                    {
                        this.state.submitted && this.state.result &&
                        <div className='alert alert-info'>{ this.state.result }</div>
                    }
                    <form onSubmit={ this.handleSubmit }>
                        <div className='field'>
                            <label htmlFor='Username'>Username</label>
                            <input type='text' name='Username' placeholder='myaccount' value={ this.state.account.Username } 
                                onChange={ this.handleChange } onBlur={ this.validateInput } maxLength={20} autoFocus required />
                            {
                                this.state.errors.Username &&
                                <div className="alert alert-danger">{ this.state.errors.Username }</div>
                            }
                        </div>
                        <div className='field'>
                            <label htmlFor='Email'>Email</label>
                            <input type='email' name='Email' placeholder='some@mail.com' value={ this.state.account.Email }
                                onChange={ this.handleChange }  onBlur={ this.validateInput } required />
                            {
                                this.state.errors.Email &&
                                <div className="alert alert-danger">{ this.state.errors.Email }</div>
                            }
                        </div>
                        <div className='field'>
                            <label htmlFor='Password'>Password</label>
                            <input type='password' name='Password' placeholder='******' value={ this.state.account.Password }
                                onChange={ this.handleChange }  onBlur={ this.validateInput } minLength={6} maxLength={10} required />
                            {
                                this.state.errors.Password &&
                                <div className="alert alert-danger">{ this.state.errors.Password }</div>
                            }
                        </div>
                        <ul className='actions'>
                            <li><button>Create account</button></li>
                        </ul>
                    </form>
                </div>
                <div className='6u$'>
                    
                </div>
            </div>
        </section>;
    }
}