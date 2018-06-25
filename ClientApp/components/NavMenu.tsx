import * as React from 'react';
import NavItem from './NavItem';

export class NavMenu extends React.Component<{}, {}> {
    public render() {
        return <nav id='nav'>
            <ul className='links'>
                <NavItem to={ '/' } exact activeClassName='active'>Home</NavItem>
                <NavItem to={ '/register' } exact activeClassName='active'>Register</NavItem>
            </ul>
            <ul className='icons'>
                <li><a href='#' className='icon fa-twitter'><span className='label'>Twitter</span></a></li>
                <li><a href='#' className='icon fa-facebook'><span className='label'>Facebook</span></a></li>
                <li><a href='#' className='icon fa-instagram'><span className='label'>Instagram</span></a></li>
                <li><a href='#' className='icon fa-github'><span className='label'>GitHub</span></a></li>
            </ul>
        </nav>;
    }
}
