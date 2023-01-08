import React, { useContext, useEffect, useRef, useState } from "react";
import { editClassOnMount } from "./functions/editClassOnMount";
import "../../sass/pages/navBar/_Notes.scss";
import { UserContextAPI } from "../../context/UserContext";
import { UserData } from "../../types/userContextTypes";
import { db } from "../../firebase/firebase-config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { AuthContextAPI } from "../../context/auth/AuthContext";
import Loader from "../custom/Loader";

type Props = {};

const Notes = (props: Props) => {
  // Context
  const { setSelectedLink, selectedLink, notes, setNotes } =
    useContext(UserContextAPI);
  const { currentUser } = useContext(AuthContextAPI);

  // Firebase
  const notesDbRef = collection(db, "notes");
  const ownerQuery = query(
    notesDbRef,
    where("owner", "==", currentUser?.uid ?? "")
  );

  // States
  const [inputTxt, setInputTxt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Refs
  const addInp = useRef<HTMLInputElement>(null);

  const setTxtValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTxt(e.target.value);
  };

  const addNote = () => {
    if (addInp.current) {
      if (!inputTxt) {
        addInp.current.focus();
        return;
      }

      if (!notes) return;

      const owner = currentUser?.uid ?? "";

      addDoc(notesDbRef, {
        owner,
        id: "",
        content: inputTxt,
        checked: false,
      });

      addInp.current.value = "";
      setInputTxt("");

      getNotes();
    }
  };

  const addByEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addNote();
  };

  const checkNote = (note: UserData["note"]) => {
    const docToUpdate = doc(db, "notes", note.id);

    updateDoc(docToUpdate, {
      owner: currentUser?.uid ?? "",
      id: note.id,
      content: note.content,
      checked: !note.checked,
    });
  };

  const delNote = (id: string) => {
    const docToDelete = doc(db, "notes", id);
    deleteDoc(docToDelete);

    getNotes();
  };

  const renderNotes = (): JSX.Element[] | JSX.Element => {
    if (notes) {
      return notes.map((note) => {
        const { id, content, checked } = note;

        return (
          <div
            className="notes-list__note bg-light-black text-white p-2 flex justify-between items-center"
            key={id}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name=""
                id=""
                checked={checked}
                className="check-note"
                onChange={() => checkNote(note)}
              />
              <p className="txt">{content}</p>
            </div>
            <div className="notes-list__note__icons">
              <img
                src="/images/delete.svg"
                alt="Delete Debter"
                onClick={() => delNote(id)}
              />
            </div>
          </div>
        );
      });
    }
    return <div>no notes error</div>;
  };

  const getNotes = () => {
    setIsLoading(true);

    onSnapshot(ownerQuery, (resp) => {
      const notesData = resp.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      setIsLoading(false);
      setNotes(notesData as UserData["note"][]);
    });
  };

  useEffect(() => {
    editClassOnMount(".main-nav__functions .notes", setSelectedLink, "notes");
    getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="main-section__notes">
      <div className="notes-container w-full flex flex-col items-center gap-3">
        {!isLoading ? (
          <div className="add-note-inp-container text-white bg-light-black px-2 py-2 rounded flex flex-wrap gap-3 w-full md:w-[450px]">
            <button
              className="violet-btn capitalize add-note-btn text-[12px] sm:text-[1rem]"
              onClick={addNote}
            >
              add note
            </button>
            <input
              type="text"
              name="add-note"
              id="add"
              placeholder="Type Your Note..."
              className="flex-1 text-[14px] sm:text-[1rem] w-full"
              onChange={setTxtValue}
              onKeyUp={addByEnter}
              ref={addInp}
            />
          </div>
        ) : (
          <Loader currentPage={selectedLink} />
        )}
        <div className="notes-list w-full md:w-[450px]">{renderNotes()}</div>
      </div>
    </section>
  );
};

export default Notes;
