import * as React from 'react';
import { NavMenu } from './NavMenu';
const AppSettings : any = require('../../appSettings.json');

export interface LayoutProps {
    children?: React.ReactNode;
}

export class Layout extends React.Component<LayoutProps, {}> {
    public render() {
        return <div id='wrapper' className='fade-in'>
        <div id='intro' className=''>
            <h1>{ AppSettings['Server']['Name'] }</h1>
            <p>{ AppSettings['Server']['Description'] }</p>
            <p className='highlight'>{ AppSettings['Server']['Realmlist'] }</p>
            <ul className='actions'>
                <li><a href='#nav' className='button icon solo fa-arrow-down scrolly'>Continue</a></li>
            </ul>
        </div>
        
        <NavMenu />
        
        <div id="nav-decorator">
            <img src='images/lich-king-2.png' />
        </div>
        <main id='main'>
            { this.props.children }
        </main>
        
        <footer id='footer'>
            <section className='contact'>
                <p>Powered by <a href='http://azerothcore.org/'>AzerothCore</a>, the extensible World of Warcraft framework. Find us on <a href='https://github.com/azerothcore'>GitHub</a> and <a href='https://discord.gg/PaqQRkd'>Discord</a></p>
            </section>
        </footer>

        <div id='copyright'>
            <ul><li>&copy; Developed with <i className='fa fa-heart'></i> by <a href='https://github.com/Deku'>Deku</a> from <a href='http://azerothcore.org/'>AzerothCore</a></li><li>Design: <a href='https://html5up.net'>HTML5 UP</a></li></ul>
        </div>
    </div>;
    }
}
