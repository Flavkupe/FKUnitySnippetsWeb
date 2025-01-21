import React, { createContext, useContext, ReactNode } from 'react';
import { SnippetLibraryValues, useSnippetLibrary } from './use-snippet-library';
import { useWebGLState, WebGLState } from './use-webgl-state';

interface LibraryContextProps extends SnippetLibraryValues, WebGLState {}

const LibraryContext = createContext<LibraryContextProps | undefined>(undefined);

export const LibraryContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const webGLState = useWebGLState();
  const snippetLibraryProps = useSnippetLibrary({ 
    webGLReady: webGLState.webGLReady,
  });

  return (
    <LibraryContext.Provider value={{ ...snippetLibraryProps, ...webGLState }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibraryContext = () => {
  const context = useContext(LibraryContext);

  if (context === undefined) {
    throw new Error('useLibraryContext must be used within an AppProvider');
  }

  return context;
};
