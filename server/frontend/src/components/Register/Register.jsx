import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setlastName] = useState('');

  const gohome = () => {
    window.location.href = window.location.origin;
  };

  const register = async (e) => {
    e.preventDefault();

    const register_url = `${window.location.origin}/djangoapp/register`;

    const res = await fetch(register_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName,
        password,
        firstName,
        lastName,
        email,
      }),
    });

    const json = await res.json();
    if (json.status) {
      sessionStorage.setItem('username', json.userName);
      window.location.href = window.location.origin;
    } else if (json.error === 'Already Registered') {
      alert('The user with same username is already registered');
      window.location.href = window.location.origin;
    }
  };

  return (
    <div className='register_container'>
      <div className='register_header'>
        <span className='register_title'>Sign Up</span>
        <button className='close_btn' type='button' onClick={gohome}>
          X
        </button>
      </div>

      <form onSubmit={register} className='register_form'>
        <div className='register_field'>
          <label htmlFor='register-username'>Username</label>
          <input
            id='register-username'
            type='text'
            name='username'
            placeholder='Enter username'
            className='input_field'
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className='register_field'>
          <label htmlFor='register-first-name'>First Name</label>
          <input
            id='register-first-name'
            type='text'
            name='first_name'
            placeholder='Enter first name'
            className='input_field'
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className='register_field'>
          <label htmlFor='register-last-name'>Last Name</label>
          <input
            id='register-last-name'
            type='text'
            name='last_name'
            placeholder='Enter last name'
            className='input_field'
            onChange={(e) => setlastName(e.target.value)}
            required
          />
        </div>

        <div className='register_field'>
          <label htmlFor='register-email'>Email</label>
          <input
            id='register-email'
            type='email'
            name='email'
            placeholder='Enter email'
            className='input_field'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='register_field'>
          <label htmlFor='register-password'>Password</label>
          <input
            id='register-password'
            name='psw'
            type='password'
            placeholder='Enter password'
            className='input_field'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className='submit_panel'>
          <input className='submit' type='submit' value='Register' />
        </div>
      </form>
    </div>
  );
};

export default Register;
