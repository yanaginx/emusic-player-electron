import React from "react";
import { ePlayer } from "../models/ePlayer";

const musicPlayer = new ePlayer();

export const EPlayerContext = React.createContext(musicPlayer);

export const EPlayerProvider = (props) => {
  return (
    <EPlayerContext.Provider value={musicPlayer}>
      {props.children}
    </EPlayerContext.Provider>
  );
};
