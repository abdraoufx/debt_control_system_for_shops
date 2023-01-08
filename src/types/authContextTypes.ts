export interface AuthContextType {
  currentUser: {
    email: string | null;
    displayName: string | null;
    uid: string;
  } | null;
  setCurrentUser: React.Dispatch<
    React.SetStateAction<{
      email: string | null;
      displayName: string | null;
      uid: string;
    } | null>
  >;
}
