import { useSelector, useDispatch } from 'react-redux';
import store from '../index';
import { useEffect } from 'react';
import { SessionStore } from '../../typings/session';
import { initialState } from '../reducer/session';

function deepMerge(obj1: any, obj2: any) {
  const result = { ...obj1 };

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (typeof obj2[key] === 'object' && obj2[key] !== null && !Array.isArray(obj2[key])) {
        result[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    }
  }

  return result;
}

export const initialSessionState = () => {
  let stateJson = localStorage.getItem('sessionState');

  if (stateJson) {
    let storedState = JSON.parse(stateJson);
    // Merge storedState with initialState
    let state = deepMerge(initialState, storedState);

    // Update each property in the store
    for (let [key, value] of Object.entries(state)) {
      store.dispatch({
        type: `session/set${key.charAt(0).toUpperCase() + key.slice(1)}`,
        payload: value,
      });
    }

    // Save the updated state back to localStorage
    localStorage.setItem('sessionState', JSON.stringify(state));
  } else {
    // Save the initialState to localStorage
    localStorage.setItem('sessionState', JSON.stringify(initialState));
  }
};

const selectSession = (state: any) => state.session;

const saveStateToLocalStorage = (state: any) => {
  localStorage.setItem('sessionState', JSON.stringify(state));
};

export const useSessionStore = (): SessionStore => {
  const dispatch = useDispatch();

  const state = useSelector(selectSession);

  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = store.subscribe(() => {
      saveStateToLocalStorage(store.getState().session);
    });

    // Clean up the subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const setCurrentSessionId = (currentSessionId: string) => {
    dispatch({ type: 'session/setCurrentSessionId', payload: currentSessionId });
  };

  const setSessions = (session: any) => {
    dispatch({ type: 'session/setSessions', payload: session });
  };

  const addSession = (session: any) => {
    dispatch({ type: 'session/addSession', payload: session });
  };

  const removeSession = (session: any) => {
    dispatch({ type: 'session/removeSession', payload: session });
  };

  const updateSession = (session: any) => {
    dispatch({ type: 'session/updateSession', payload: session });
  };

  const clearSessions = () => {
    dispatch({ type: 'session/clearSessions' });
  };

  const setMessageCount = (session: any) => {
    dispatch({ type: 'session/setMessageCount', payload: session });
  };

  const setLiked = (session: any) => {
    dispatch({ type: 'session/setLiked', payload: session });
  };

  return {
    ...state,
    setCurrentSessionId,
    setSessions,
    addSession,
    removeSession,
    updateSession,
    clearSessions,
    setMessageCount,
    setLiked,
  };
};
