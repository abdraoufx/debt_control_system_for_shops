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
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContextAPI } from "../../context/auth/AuthContext";
import { UserContextAPI } from "../../context/UserContext";
import { db } from "../../firebase/firebase-config";
import { UserData } from "../../types/userContextTypes";
import Loader from "../custom/Loader";
import { editClassOnMount } from "./functions/editClassOnMount";

export const WEEK_DAYS_LIST: string[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

type Props = {};

const TAOTC = (props: Props) => {
  // Context
  const { setSelectedLink, commedities, setCommedities } =
    useContext(UserContextAPI);

  const { currentUser } = useContext(AuthContextAPI);

  // Firebase
  const commeditiesDbRef = collection(db, "commedities");
  const ownerQuery = query(
    commeditiesDbRef,
    where("owner", "==", currentUser?.uid ?? "")
  );

  const defaultFormData: UserData["commedity"] = {
    owner: "",
    id: "",
    name: "",
    day: "",
  };

  // States
  const [clonedCommedities, setClonedCommedities] = useState<
    UserData["commedity"][]
  >([]);
  const [formData, setFormData] =
    useState<UserData["commedity"]>(defaultFormData);
  const [searchFilled, setSearchFilled] = useState<boolean>(false);
  const [itemIdToEdit, setItemIdToEdit] = useState<string>("");
  const [isAddBoxShowed, setIsAddBoxShowed] = useState<boolean>(false);
  const [invalidDayMsg, setInvalidDayMsg] = useState("");
  const [commedityNotFound, setCommedityNotFound] = useState<boolean>(false);
  const [errorOnAdd, setErrorOnAdd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Refs
  const searchInp = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const itemNameInp = document.querySelector<HTMLInputElement>("#name"),
      dayInp = document.querySelector<HTMLInputElement>("#day");

    if (itemNameInp && dayInp) {
      // Check If Day Input Is A Valid Day
      if (!WEEK_DAYS_LIST.find((d) => d === dayInp.value.toLowerCase())) {
        setInvalidDayMsg("invalid day of the week");
        return;
      }
    }

    setInvalidDayMsg("");

    if (!commedities) return;

    if (!itemIdToEdit) {
      // Add Commedity
      formData.owner = currentUser?.uid ?? "";

      addDoc(commeditiesDbRef, formData)
        .then((data) => {
          return { ...data };
        })
        .catch((err) => {
          setErrorOnAdd(true);
        });

      getCommedities();
      setIsAddBoxShowed(false);
      return;
    }

    if (itemNameInp && dayInp) {
      // Update Doc
      const docToUpdate = doc(db, "commedities", itemIdToEdit);
      updateDoc(docToUpdate, {
        owner: currentUser?.uid ?? "",
        id: itemIdToEdit,
        name: itemNameInp.value,
        day: dayInp.value,
      });

      getCommedities();
    }

    if (searchInp.current) {
      // Prevent Search Result When Editing.
      searchInp.current.value = "";
      setSearchFilled(false);
    }

    setItemIdToEdit("");

    setFormData(defaultFormData);
    resetInput();
    setIsAddBoxShowed(false);
  };

  const getCommedities = (): void => {
    setIsLoading(true);

    onSnapshot(ownerQuery, (resp) => {
      const commeditiesData = resp.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      setIsLoading(false);
      setCommedities(commeditiesData as UserData["commedity"][]);
      setClonedCommedities(commeditiesData as UserData["commedity"][]);
    });
  };

  const setValues = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.id === "day") setInvalidDayMsg("");
    if (errorOnAdd) setErrorOnAdd(false);
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const resetSearch = (): void => {
    if (searchInp.current) {
      searchInp.current.value = "";

      setSearchFilled(false);
      setCommedityNotFound(false);
      setClonedCommedities([...(commedities ?? [])]);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      target: { value },
    } = e;

    setCommedityNotFound(false);

    if (value.length === 0) {
      resetSearch();
      setSearchFilled(false);
      setClonedCommedities([...(commedities ?? [])]);
      return;
    }

    if (value.length >= 1) setSearchFilled(true);

    const searchValue: string = value.toLowerCase();

    if (!commedities) return;

    if (commedities.find(({ name }) => name.includes(searchValue))) {
      setClonedCommedities(
        commedities.filter(({ name }) => name.includes(searchValue))
      );
    } else if (commedities.find(({ day }) => day.includes(searchValue))) {
      setClonedCommedities(
        commedities.filter(({ day }) => day.includes(searchValue))
      );
    } else {
      setCommedityNotFound(true);
    }
  };

  const addNewItem = (): void => {
    setItemIdToEdit("");
    setIsAddBoxShowed(true);
  };

  const editItem = (item: UserData["commedity"]): void => {
    resetInput(item.name, item.day);

    setIsAddBoxShowed(true);
    setItemIdToEdit(item.id);
  };

  const delItem = (id: string): void => {
    if (!commedities) return;

    if (searchInp.current) {
      // Prevent Search Result When Deleting.
      searchInp.current.value = "";

      setSearchFilled(false);

      const docToDelete = doc(db, "commedities", id);
      deleteDoc(docToDelete);

      getCommedities();
    }
  };

  const handleClosingBox = (): void => {
    setIsAddBoxShowed(false);
    setFormData(defaultFormData);

    setInvalidDayMsg("");
    resetInput();
  };

  const renderItems = (): JSX.Element | JSX.Element[] => {
    if (commedities) {
      return clonedCommedities.map((item) => {
        const { id, name, day } = item;

        return (
          <tr key={id}>
            <td>{name}</td>
            <td className="text-center text-[15px]">
              <span className="font-bold">{day}</span> Of Each Week
            </td>
            <td className="operations">
              <img
                src="/images/edit.svg"
                alt="Edit Debter"
                onClick={() => editItem(item)}
              />
              <img
                src="/images/delete.svg"
                alt="Delete Debter"
                onClick={() => delItem(id)}
              />
            </td>
          </tr>
        );
      });
    }
    return <div>No Commedities Founded</div>;
  };

  const listCommedities = (): JSX.Element => {
    if (isLoading) return <Loader currentPage="commedities" />;

    if (!commedities?.length)
      return <div className="not-found-err">No Commedities Founded.</div>;

    return (
      <div className="list-commedities">
        <table className="bg-light-black text-white mx-auto">
          <thead className="text-[14px]">
            <tr>
              <th>Item Name</th>
              <th>Day</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>{renderItems()}</tbody>
        </table>
      </div>
    );
  };

  const resetInput = (name?: string, day?: string): void => {
    const itemNameInp = document.querySelector<HTMLInputElement>("#name"),
      dayInp = document.querySelector<HTMLInputElement>("#day");

    if (itemNameInp && dayInp) {
      itemNameInp.value = name ?? "";
      dayInp.value = day ?? "";
    }
  };

  useEffect(() => {
    editClassOnMount(".main-nav__functions .taotc", setSelectedLink, "taotc");
    getCommedities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="main-section__taotc">
      {!isLoading && (
        <div className="btns-and-search">
          <button
            className="violet-btn text-white rounded-full px-4 py-1 mt-2"
            onClick={addNewItem}
          >
            Add New Item
          </button>
          {commedities && commedities.length ? (
            <div
              className="btns-and-search__search"
              onClick={() => searchInp.current && searchInp.current.focus()}
            >
              {!searchFilled ? (
                <img src="/images/search-violet.svg" alt="Search Icon" />
              ) : (
                <img
                  src="/images/reset.svg"
                  alt="Reset Icon"
                  onClick={resetSearch}
                  className="cursor-pointer"
                />
              )}
              <input
                type="text"
                name="search-for-sched"
                id="searchSched"
                placeholder="Search For Scheduele..."
                ref={searchInp}
                onChange={handleSearch}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      )}
      {!commedityNotFound ? (
        listCommedities()
      ) : (
        <div className="not-found-err">Commedity Not Found</div>
      )}
      <div
        className={`add-new-sched transition-opacity ${
          !isAddBoxShowed
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}
      >
        <form
          action="#"
          className="add-new-sched__form add-new-box text-white"
          onSubmit={handleFormSubmit}
        >
          <div className="img-wrapper">
            <img
              src="/images/customers-page/close-icon.svg"
              alt="Close Icon"
              className="img-wrapper__close-icon"
              onClick={handleClosingBox}
            />
          </div>
          <div className="inputs capitalize flex justify-between commedities-center gap-2">
            <div className="inputs__one text-[15px] sm:text-[1rem]">
              <label htmlFor="name">Item Name</label>
              <input
                type="text"
                name="item-name"
                id="name"
                required
                onChange={setValues}
              />
            </div>
            <div className="inputs__two">
              <label htmlFor="day" className="text-[15px] sm:text-[1rem]">
                Day Of The Week
              </label>
              <input
                type="text"
                name="item-day"
                id="day"
                required
                onChange={setValues}
                placeholder="Sunday, Monday, ..."
              />
            </div>
          </div>
          {invalidDayMsg && (
            <div className="invalid-day-err text-center mb-2">
              <span className="invalid-day-err__msg text-err-red">
                {invalidDayMsg}
              </span>
            </div>
          )}
          {errorOnAdd && (
            <div className="user-err">Error Aqquired, Try Again</div>
          )}
          <div className="btn-wrapper">
            <button className="btn-wrapper__btn violet-btn">
              {itemIdToEdit ? "edit item" : "add item"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default TAOTC;
