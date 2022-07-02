import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

import { useEffect } from 'react';

import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { useStateValue } from './contexts/StateProvider';

import { GET } from './utils/axios';

// views
import MainView from './views/MainView';
import Login from './views/Login';
import Logout from './views/Logout';
import Teller from './views/teller/Teller';
import Guard from './views/guard/Guard'
import Admin from './views/admin/Admin'
import UsersList from './components/UsersList';
import CreateUser from './components/CreateUser';
import WindowsList from './components/WindowsList';
import CreateWindow from './components/CreateWindow';
import EditUser from './components/EditUser';
import EditWindow from './components/EditWindow';
import UserHistory from './components/UserHistory';
import Media from './components/Media';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [{
    user,
    public_routes,
    error,
    source
  }, dispatch] = useStateValue();

  const currentUser = localStorage.getItem('user');

  const checkToken = async function() {
    if (!currentUser) {
      return navigate('/logout', { replace: true });
    }

    const { request, source } = GET('/refresh-token');

    dispatch({
      type: 'SET_SOURCE',
      source
    });

    try {
      const { data: { user, credentials: { access_token, refresh_token } } } = await request;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
    }
    catch(err) {
      if (err && err.response && err.response.data) {
        return navigate('/logout', { replace: true });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (source) {
        source.cancel('Cancelling...');

        dispatch({
          type: 'SET_SOURCE',
          source: null
        });
      }
    }
  }, [source]);

  useEffect(() => {
    try {
      dispatch({
        type: 'SET_USER',
        user: JSON.parse(currentUser)
      });
      
      if (!public_routes.some((x) => x === location.pathname)) {
        checkToken();
      }
    }
    catch(err) {

    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!user && public_routes.some((x) => x === location.pathname)) {
      return;
    }
    
    if (user && ['SUPERADMIN', 'ADMIN'].includes(user?.role) && !location.pathname.includes('/admin')) {
      return navigate('/admin', { replace: true });
    }

    if (user && user?.role === 'TELLER' && !location.pathname.includes('/teller')) {
      return navigate('/teller', { replace: true });
    }

    if (user && user?.role === 'GUARD' && !location.pathname.includes('/guard')) {
      return navigate('/guard', { replace: true });
    }
    
    // eslint-disable-next-line
  }, [user, location]);

  useEffect(() => {
    if (!currentUser && !public_routes.some((x) => x === location.pathname)) {
      return navigate('/login');
    }
  }, [location]);

  return (
    <>
      <Routes>
        <Route path='/' element={<MainView />} /> 
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/teller' element={<Teller />}/>
        <Route path='/guard' element={<Guard/>}/>
        <Route path='/admin' element={<Admin/>}>
          <Route index element={<Media />}/>
          <Route path='user' element={<UsersList/>} /> 
          <Route path='user/create' element={<CreateUser/>}/>
          <Route path='user/:id' element={<EditUser />}/>
          <Route path='windows' element={<WindowsList />} />
          <Route path='windows/create' element={<CreateWindow />}/>
          <Route path='user/:id' element={<EditUser />}/>
          <Route path='windows/:id' element={<EditWindow />}/>
          <Route path='user/:id/history' element={<UserHistory />}/>
          <Route
            path="*"
            element={
              <main style={{padding: '1rem'}}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;