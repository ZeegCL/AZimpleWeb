import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FactionBar from './FactionBar';
const AppSettings : any = require('../../appSettings.json');

export class Home extends React.Component<RouteComponentProps<{}>, { realms: any; }> {

    constructor(props: any) {
        super(props);

        this.state = { realms: [] };

        axios.get('/api/Server/Realms')
            .then((response) => {
                this.setState({ realms: response.data });
                console.log(this.state.realms);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }

    public render() {
        return (<section>
                    <div id='server-info' className='row'>
                        <div className='4u'>
                            <span className='image fit'>
                                <img src='images/pve.jpg' />
                            </span>
                        </div>
                        <div className='4u'>
                            <span className='image fit'>
                                <img src='images/pvp.jpg' />
                            </span>
                        </div>
                        <div className='4u$'>
                            <span className='image fit'>
                                <img src='images/ulduar.jpg' />
                            </span>
                        </div>

                        <div className='10u$ -1u'>
                            <h2>Welcome to our server!</h2>
                            <p>
                                Prepare to experience a wonderful adventure with your friends in Azeroth. Join us
                                and enjoy World of Warcraft as you never did before. We bring you the best of PvP and PvE thanks to the continuous 
                                support of AzerothCore's team.
                            </p>
                        </div>
                    </div>

                    { 
                        AppSettings['Features'].length > 0 &&
                        <div id='features' className='row'>
                            {
                                AppSettings['Features'].map((feature: any, idx: number) => {
                                    return <div id={ 'feature-' + idx } className='4u 12u$(xsmall)'>
                                        <span className={ 'icon major ' + feature.Icon }></span>
                                        <h4>{feature.Title}</h4>
                                        <p>{feature.Text}</p>
                                    </div>
                                })
                            }
                        </div>
                    }
                    
                    <div className='row'>
                        <div className='10u$ -1u'>
                            <h3>Realms</h3>
                            {
                                this.state.realms.map((r: any, idx: number) => {
                                    return <div id={ 'realm-' + idx } className='well'>
                                        <h4>{ r.name } ({ r.type })</h4>
                                        <FactionBar id={ r.id } />
                                    </div>
                                })
                            }
                        </div>
                    </div>

                    <div className='row'>
                        <div className='10u$ -1u text-center'>
                            <h2>What are you waiting for?</h2>
                            <p>Register right now and become a hero in the World of Warcraft!</p>
                            <Link to='/register' className='button big special'>Register now</Link>
                        </div>
                    </div>
                </section>);
    }
}
