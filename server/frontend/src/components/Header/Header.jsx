import React from 'react';
import '../assets/bootstrap.min.css';
import '../assets/style.css';

const Header = () => {
  const logout = async (e) => {
    e.preventDefault();
    const logout_url = `${window.location.origin}/djangoapp/logout`;
    const res = await fetch(logout_url, {
      method: 'GET',
    });

    const json = await res.json();
    if (json) {
      const username = sessionStorage.getItem('username');
      sessionStorage.removeItem('username');
      window.location.href = window.location.origin;
      window.location.reload();
      alert(`Logging out ${username}...`);
    } else {
      alert('The user could not be logged out.');
    }
  };

  let home_page_items = <div></div>;
  const curr_user = sessionStorage.getItem('username');

  if (curr_user !== null && curr_user !== '') {
    home_page_items = (
      <div className='input_panel'>
        <span className='username'>{sessionStorage.getItem('username')}</span>
        <a className='nav_item' href='/djangoapp/logout' onClick={logout}>
          Logout
        </a>
      </div>
    );
  }

  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-light' style={{ backgroundColor: 'darkturquoise', height: '1in' }}>
        <div className='container-fluid'>
          <h2 style={{ paddingRight: '5%' }}>Dealerships</h2>
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
                <a className='nav-link active' style={{ fontSize: 'larger' }} aria-current='page' href='/'>
                  Home
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' style={{ fontSize: 'larger' }} href='/about'>
                  About Us
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' style={{ fontSize: 'larger' }} href='/contact'>
                  Contact Us
                </a>
              </li>
            </ul>
            <span className='navbar-text'>
              <div className='loginlink' id='loginlogout'>
                {home_page_items}
              </div>
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
