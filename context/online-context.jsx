import { useEffect, useState, createContext, useContext } from 'react';

export const OnlineContext = createContext();

export function OnlineContextProvider(props) {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const online = navigator.onLine;
    setOnline(online);

    window.ononline = () => {
      setOnline(true);
    };
    window.onoffline = () => {
      setOnline(false);
    };
  }, []);

  const value = { online };

  return <OnlineContext.Provider value={value} {...props} />;
}

export function useOnline() {
  const context = useContext(OnlineContext);
  return context;
}
