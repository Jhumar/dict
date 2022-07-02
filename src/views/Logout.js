import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useStateValue } from './../contexts/StateProvider';

function Logout() {
  const navigate = useNavigate();

  const [, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: 'SET_USER',
      user: null
    });

    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    navigate('/login', { replace: true });

    // eslint-disable-next-line
  });

  return (
    <></>
  );
}

export default Logout;