import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  timeout: 10000,
});

const POST = (url, body = {}, headers = {}) => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  let source = axios.CancelToken.source();

  const request = instance.post(url, body, {
    headers: {
      ...headers,
      'Access-Token': accessToken,
      'Refresh-Token': refreshToken
    },
    cancelToken: source.token,
  });

  return {
    request,
    source,
  };
};

const GET = (url, headers = {}) => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  let source = axios.CancelToken.source();

  const request = instance.get(url, {
    headers: {
      ...headers,
      'Access-Token': accessToken,
      'Refresh-Token': refreshToken
    },
    cancelToken: source.token,
  });

  return {
    request,
    source,
  };
};

const PATCH = (url, body = {}, headers = {}) => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  let source = axios.CancelToken.source();

  const request = instance.patch(url, body, {
    headers: {
      ...headers,
      'Access-Token': accessToken,
      'Refresh-Token': refreshToken
    },
    cancelToken: source.token,
  });

  return {
    request,
    source,
  };
};

const DELETE = (url, headers = {}) => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  let source = axios.CancelToken.source();

  const request = instance.delete(url, {
    headers: {
      ...headers,
      'Access-Token': accessToken,
      'Refresh-Token': refreshToken
    },
    cancelToken: source.token,
  });

  return {
    request,
    source,
  };
};

export { GET, POST, PATCH, DELETE };
