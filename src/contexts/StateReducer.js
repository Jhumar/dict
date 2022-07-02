export const initialState = {
  public_routes: ['/', '/login'],
  error: null,
  user: null,
  source: null
};

export const reducer = (state, action) => {
  switch(action.type) {
    case 'SET_USER': {
      return {
        ...state,
        user: action.user
      }
    }
    case 'SET_ERROR': {
      return {
        ...state,
        error: action.error
      }
    }
    case 'REMOVE_ERROR': {
      return {
        ...state,
        error: null
      }
    }
    case 'SET_SOURCE': {
      const { source } = state;
      
      if (source) {
        source.cancel('Cancelling...');

        return {
          ...state,
          source: null
        };
      }

      return {
        ...state,
        source: action.source
      }
    }
    default:
      return state;
  }
};