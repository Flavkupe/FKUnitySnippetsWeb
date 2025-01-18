import React, { createContext, useContext, ReactNode } from 'react';
import { SnippetLibraryValues, useSnippetLibrary } from './use-snippet-library';

interface LibraryContextProps extends SnippetLibraryValues {}

const LibraryContext = createContext<LibraryContextProps | undefined>(undefined);

export const LibraryContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const snippetLibraryProps = useSnippetLibrary();

  return (
    <LibraryContext.Provider value={{ ...snippetLibraryProps }}>
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
