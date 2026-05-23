const initialState = {
  user: null,
  token: localStorage.getItem(process.env.REACT_APP_JWT_TOKEN_KEY || 'forum_jwt_token'),
  isLoading: false,
  error: null
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    
    case 'AUTH_SUCCESS':
      localStorage.setItem(
        process.env.REACT_APP_JWT_TOKEN_KEY || 'forum_jwt_token',
        action.payload.token
      );
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null
      };
    
    case 'AUTH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    
    case 'AUTH_LOGOUT':
      localStorage.removeItem(process.env.REACT_APP_JWT_TOKEN_KEY || 'forum_jwt_token');
      return { ...state, user: null, token: null };
    
    default:
      return state;
  }
};

export const register = (data) => async (dispatch) => {
  dispatch({ type: 'AUTH_START' });
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Registration failed');
    
    const result = await response.json();
    dispatch({ type: 'AUTH_SUCCESS', payload: result });
  } catch (error) {
    dispatch({ type: 'AUTH_FAILURE', payload: error.message });
  }
};

export const login = (data) => async (dispatch) => {
  dispatch({ type: 'AUTH_START' });
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Login failed');
    
    const result = await response.json();
    dispatch({ type: 'AUTH_SUCCESS', payload: result });
  } catch (error) {
    dispatch({ type: 'AUTH_FAILURE', payload: error.message });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: 'AUTH_LOGOUT' });
};
