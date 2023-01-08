export interface UserData {
  debter: {
    owner: string;
    id: string;
    name: string;
    mobile: string;
    job: string;
    debt: number;
  };

  debertsToday: {
    owner: string;
    day: number;
    quantity: number;
  };

  note: {
    id: string;
    content: string;
    checked: boolean;
  };

  salarySched: {
    owner: string;
    id: string;
    jobName: string;
    time: string;
  };

  missingItem: {
    owner: string;
    id: string;
    name: string;
  };

  commedity: {
    owner: string;
    id: string;
    name: string;
    day: string;
  };
}

export interface LatestDebter {
  name: string;
  job: string;
}

export interface LastMotive {
  id: string;
  name: string;
  prevDebt: number;
  debt: number;
}

export interface UserContextType {
  selectedLink: string;
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;

  debters: UserData["debter"][] | null;
  setDebters: React.Dispatch<React.SetStateAction<UserData["debter"][] | null>>;

  debtersToday: UserData["debertsToday"][] | null;
  setDebtersToday: React.Dispatch<
    React.SetStateAction<UserData["debertsToday"][] | null>
  >;

  latestDebter: LatestDebter[] | null;
  setLatestDebter: React.Dispatch<React.SetStateAction<LatestDebter[] | null>>;

  notes: UserData["note"][] | null;
  setNotes: React.Dispatch<React.SetStateAction<UserData["note"][] | null>>;

  lastMotive: LastMotive[] | null;
  setLastMotive: React.Dispatch<React.SetStateAction<LastMotive[] | null>>;

  schedueles: UserData["salarySched"][] | null;
  setSchedueles: React.Dispatch<
    React.SetStateAction<UserData["salarySched"][] | null>
  >;

  missingItems: UserData["missingItem"][] | null;
  setMissingItems: React.Dispatch<
    React.SetStateAction<UserData["missingItem"][] | null>
  >;

  commedities: UserData["commedity"][] | null;
  setCommedities: React.Dispatch<
    React.SetStateAction<UserData["commedity"][] | null>
  >;
}

export type contextProviderProps = {
  children: React.ReactNode;
};
