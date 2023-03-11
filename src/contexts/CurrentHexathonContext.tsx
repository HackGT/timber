import React, { useContext, createContext, PropsWithChildren } from "react";

const initialState = {
  currentHexathon: undefined,
  setCurrentHexathon: undefined,
};

const CurrentHexathonContext = createContext<any>(initialState);

export function useCurrentHexathon() {
  return useContext(CurrentHexathonContext);
}

export default CurrentHexathonContext;

