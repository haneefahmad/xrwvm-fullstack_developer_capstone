import React from 'react';
import '../assets/bootstrap.min.css';
import '../assets/style.css';

const Header = () => {
  const logout = (e) => {
    e.preventDefault();

    sessionStorage.clear();

    fetch(`${window.location.origin}/djangoapp/logout`, {
      method: 'GET',
      credentials: 'include',
      keepalive: true,
    }).finally(() => {
      window.location.replace('/');
    });
  };

  const path = window.location.pathname;
  const isHome = path === '/';
  const isAbout = path.startsWith('/about');
  const isContact = path.startsWith('/contact');

  let homePageItems = <div></div>;
  const currUser = sessionStorage.getItem('username');

  if (currUser !== null && currUser !== '') {
    homePageItems = (
      <div className='input_panel'>
        <span className='username nav-username'>{currUser}</span>
        <a className='nav_item nav-cta logout-btn' href='/' onClick={logout}>
          Logout
        </a>
      </div>
    );
  }

  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-dark main-navbar'>
        <div className='container-fluid'>
          <h2 className='brand-title'>Dealerships</h2>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarText'
            aria-controls='navbarText'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarText'>
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
              <li className='nav-item'>
                <a className={`nav-link main-nav-link ${isHome ? 'active' : ''}`} aria-current='page' href='/'>
                  Home
                </a>
              </li>
              <li className='nav-item'>
                <a className={`nav-link main-nav-link ${isAbout ? 'active' : ''}`} href='/about'>
                  About Us
                </a>
              </li>
              <li className='nav-item'>
                <a className={`nav-link main-nav-link ${isContact ? 'active' : ''}`} href='/contact'>
                  Contact Us
                </a>
              </li>
            </ul>
            <span className='navbar-text'>
              <div className='loginlink' id='loginlogout'>
                {homePageItems}
              </div>
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
