import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

export const useAuth = () => {
  return useSelector(state => state.auth);
};

export const useFetch = (fetchFn) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    try {
      const result = await fetchFn(...args);
      setData(result.data);
      setError(null);
      return result.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};
