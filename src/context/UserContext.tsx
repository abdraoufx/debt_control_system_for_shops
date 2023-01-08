import { createContext, useState } from "react";
import {
  contextProviderProps,
  LastMotive,
  LatestDebter,
  UserContextType,
  UserData,
} from "../types/userContextTypes";

const ctxDefaultValues = {
  selectedLink: "",
  setSelectedLink: () => {},

  debters: null,
  setDebters: () => {},

  debtersToday: null,
  setDebtersToday: () => {},

  latestDebter: null,
  setLatestDebter: () => {},

  notes: null,
  setNotes: () => {},

  lastMotive: null,
  setLastMotive: () => {},

  schedueles: null,
  setSchedueles: () => {},

  missingItems: null,
  setMissingItems: () => {},

  commedities: null,
  setCommedities: () => {},
};

export const UserContextAPI = createContext<UserContextType>(ctxDefaultValues);

const UserContext = ({ children }: contextProviderProps) => {
  const [selectedLink, setSelectedLink] = useState<string>("");

  // Debters States
  const [debters, setDebters] = useState<UserData["debter"][] | null>([]);
  const [debtersToday, setDebtersToday] = useState<
    UserData["debertsToday"][] | null
  >([]);
  const [latestDebter, setLatestDebter] = useState<LatestDebter[] | null>(null);
  const [lastMotive, setLastMotive] = useState<LastMotive[] | null>(null);

  // Notes States
  const [notes, setNotes] = useState<UserData["note"][] | null>([]);

  // Schedueles States
  const [schedueles, setSchedueles] = useState<
    UserData["salarySched"][] | null
  >([]);

  // Missing Items States
  const [missingItems, setMissingItems] = useState<
    UserData["missingItem"][] | null
  >([]);

  // TAOTC States
  const [commedities, setCommedities] = useState<
    UserData["commedity"][] | null
  >([]);

  return (
    <UserContextAPI.Provider
      value={{
        selectedLink,
        setSelectedLink,

        debters,
        setDebters,

        debtersToday,
        setDebtersToday,

        latestDebter,
        setLatestDebter,

        notes,
        setNotes,

        lastMotive,
        setLastMotive,

        schedueles,
        setSchedueles,

        missingItems,
        setMissingItems,

        commedities,
        setCommedities,
      }}
    >
      {children}
    </UserContextAPI.Provider>
  );
};

export default UserContext;
