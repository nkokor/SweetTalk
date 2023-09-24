import React, { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [showChat, setShowChat] = useState(false);

  return (
    <GlobalContext.Provider value={{ globalVariable: showChat, setGlobalVariable: setShowChat }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}