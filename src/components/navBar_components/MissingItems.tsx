import React, { useContext, useEffect, useRef, useState } from "react";
import { editClassOnMount } from "./functions/editClassOnMount";
import "../../sass/pages/navBar/_MissingItems.scss";
import { UserContextAPI } from "../../context/UserContext";
import { UserData } from "../../types/userContextTypes";
import { AuthContextAPI } from "../../context/auth/AuthContext";
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
import Loader from "../custom/Loader";

type Props = {};

const MissingItems = (props: Props) => {
  // Context
  const { setSelectedLink, missingItems, setMissingItems } =
    useContext(UserContextAPI);

  const { currentUser } = useContext(AuthContextAPI);

  const defaultFormData: UserData["missingItem"] = {
    owner: "",
    id: "",
    name: "",
  };

  // Firebase
  const missingItemsDbRef = collection(db, "missingItems");
  const ownerQuery = query(
    missingItemsDbRef,
    where("owner", "==", currentUser?.uid ?? "")
  );

  // States
  const [clonedItems, setClonedItems] = useState<UserData["missingItem"][]>([]);
  const [formData, setFormData] =
    useState<UserData["missingItem"]>(defaultFormData);
  const [itemIdToEdit, setItemIdToEdit] = useState<string>("");

  const [searchFilled, setSearchFilled] = useState<boolean>(false);
  const [isAddBoxShowed, setIsAddBoxShowed] = useState<boolean>(false);
  const [itemNotFound, setItemNotFound] = useState<boolean>(false);
  const [errorOnAdd, setErrorOnAdd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Refs
  const searchInp = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const itemNameInp = document.querySelector<HTMLInputElement>("#name");

    if (!missingItems) return;

    if (!itemIdToEdit) {
      // Add Missing Item
      formData.owner = currentUser?.uid ?? "";

      addDoc(missingItemsDbRef, formData)
        .then((data) => {
          return { ...data };
        })
        .catch((err) => {
          setErrorOnAdd(true);
        });

      getItems();

      setIsAddBoxShowed(false);
      return;
    }

    // Update Item
    if (itemNameInp) {
      const docToUpdate = doc(db, "missingItems", itemIdToEdit);
      updateDoc(docToUpdate, {
        owner: currentUser?.uid ?? "",
        id: itemIdToEdit,
        name: itemNameInp.value,
      });

      getItems();
    }

    if (searchInp.current) {
      // Prevent Search Result When Editing.
      searchInp.current.value = "";
      setSearchFilled(false);
    }

    setClonedItems([...missingItems]);
    setItemIdToEdit("");

    setFormData(defaultFormData);
    resetInput();
    setIsAddBoxShowed(false);
  };

  const getItems = (): void => {
    setIsLoading(true);

    onSnapshot(ownerQuery, (resp) => {
      const commeditiesData = resp.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      setIsLoading(false);
      setMissingItems(commeditiesData as UserData["commedity"][]);
      setClonedItems(commeditiesData as UserData["commedity"][]);
    });
  };

  const setValues = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (errorOnAdd) setErrorOnAdd(false);

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const addNewItem = (): void => {
    setIsAddBoxShowed(true);
    setItemIdToEdit("");
  };

  const resetSearch = (): void => {
    if (searchInp.current) {
      searchInp.current.value = "";

      setSearchFilled(false);
      setItemNotFound(false);
      setClonedItems([...(missingItems ?? [])]);
    }
  };

  const searchForItem = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      target: { value },
    } = e;

    setItemNotFound(false);

    if (value.length === 0) {
      setSearchFilled(false);
      resetSearch();
      setItemNotFound(false);
      return;
    }

    if (value.length > 0) setSearchFilled(true);

    const searchValue: string = value.toLowerCase();

    if (!missingItems) return;

    if (missingItems.find(({ name }) => name.includes(searchValue))) {
      setClonedItems(
        missingItems.filter(({ name }) => name.includes(searchValue))
      );
    } else {
      setItemNotFound(true);
    }
  };

  const delItem = (id: string): void => {
    if (!missingItems) return;

    if (searchInp.current) {
      // Prevent Search Result When Deleting.
      searchInp.current.value = "";

      setSearchFilled(false);

      const docToDelete = doc(db, "missingItems", id);
      deleteDoc(docToDelete);

      getItems();
    }
  };

  const editItem = (item: UserData["missingItem"]): void => {
    resetInput(item.name);

    setIsAddBoxShowed(true);
    setItemIdToEdit(item.id);
  };

  const handleClosingBox = (): void => {
    setIsAddBoxShowed(false);
    setFormData(defaultFormData);

    resetInput();
  };

  const renderItems = (): JSX.Element[] | JSX.Element => {
    if (missingItems) {
      return clonedItems.map((item) => {
        const { id, name } = item;

        return (
          <tr key={id}>
            <td>{name}</td>
            <td className="operations">
              <img
                src="/images/edit.svg"
                alt="Edit Icon"
                onClick={() => editItem(item)}
              />
              <img
                src="/images/delete.svg"
                alt="Delete Icon"
                onClick={() => delItem(id)}
              />
            </td>
          </tr>
        );
      });
    }
    return <span>No Items Founded</span>;
  };

  const listItems = (): JSX.Element => {
    if (isLoading) return <Loader currentPage="items" />;

    if (!missingItems?.length)
      return <div className="not-found-err">No Items Founded.</div>;

    return (
      <div className="m-items-list">
        <table className="md:w-[500px]">
          <thead>
            <tr>
              <th className="text-left">Item Name</th>
              <th className="text-right">Operations</th>
            </tr>
          </thead>
          <tbody>{renderItems()}</tbody>
        </table>
      </div>
    );
  };

  const resetInput = (itemName?: string): void => {
    const itemNameInp = document.querySelector<HTMLInputElement>("#name");

    if (itemNameInp) itemNameInp.value = itemName ?? "";
  };

  // const loaderJSX = (): JSX.Element => {
  //   return
  // }

  useEffect(() => {
    editClassOnMount(
      ".main-nav__functions .missing-items",
      setSelectedLink,
      "missing-items"
    );
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="main-section__missing-items">
      {!isLoading && (
        <div className="btns-and-search">
          <div className="btns-and-search__btns">
            <button
              className="violet-btn text-white rounded-full px-4 py-1 mt-2"
              onClick={addNewItem}
            >
              Add New Missing Item
            </button>
          </div>
          {missingItems && missingItems.length ? (
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
                name="search"
                id="searchItem"
                placeholder="Search For Item..."
                ref={searchInp}
                onChange={searchForItem}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      )}
      {!itemNotFound ? (
        listItems()
      ) : (
        <div className="not-found-err">Item Not Found</div>
      )}

      <div
        className={`add-new-item transition-opacity ${
          !isAddBoxShowed
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}
      >
        <form
          action="#"
          className="add-new-item__form add-new-box text-white"
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
          <div className="inputs capitalize flex justify-center">
            <label htmlFor="name">
              item name{" "}
              <input
                type="text"
                name="item-name"
                id="name"
                required
                onChange={setValues}
              />
            </label>
          </div>
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

export default MissingItems;
