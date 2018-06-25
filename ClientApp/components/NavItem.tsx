import * as React from 'react';
import { Link, NavLink, NavLinkProps } from 'react-router-dom';

class NavItem extends React.Component<NavLinkProps, {}> {
  render () {
    const { activeClassName, exact, to, children, ...props } = this.props
    const isActive : boolean = location.pathname === to.toString();

    return (
      <li className={ isActive ? 'active' : '' }>
        <NavLink {...this.props}>{children}</NavLink>
      </li>
    )
  }
}

export default NavItem;