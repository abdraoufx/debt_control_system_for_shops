import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContextAPI } from "../../context/auth/AuthContext";
import { UserContextAPI } from "../../context/UserContext";
import { db } from "../../firebase/firebase-config";
import "../../sass/pages/navBar/_Debters.scss";
import { UserData } from "../../types/userContextTypes";
import Loader from "../custom/Loader";
import { totalDebt } from "./Dashboard";
import { editClassOnMount } from "./functions/editClassOnMount";

/* 
  * TODO:
    1 => Fix The id Problem Why Not Reflecting On The Database DONE:.
    2 => Make The onSpanShot For RealTime Updates DONE:.
    3 => Make The Query Based On The Owner Key Value DONE:.
    4 => Make The Debters Today By Adding An Key To Object With Value Of Today And Num Of Debters Today And Compare EveryDay.
      => If It Is Equal To Today Add To The Num
      => If It Is Not Equal Make It To 0 `Overwrite`
 */

enum SortingDirection {
  UNSORTED = "UNSORTED",
  DECENDING = "DECENDING",
  ACENDING = "ACENDING",
}

type Props = {};

export const settingLatestDebter = async (
  uid: string,
  nameValue: string,
  jobValue: string
) => {
  const docRef = doc(db, "latestDebter", uid ?? "");
  const docSnap = await getDoc(docRef);

  const latestDebterData = {
    owner: uid,
    name: nameValue,
    job: jobValue,
  };

  if (docSnap.exists()) {
    const docToUpdate = doc(db, "latestDebter", uid ?? "");
    updateDoc(docToUpdate, latestDebterData);
  } else {
    setDoc(docRef, latestDebterData);
  }
};

export const settingDebtersToday = async (uid: string) => {
  const docRef = doc(db, "debtersToday", uid ?? "");
  const docSnap = await getDoc(docRef);

  const CURRENT_DATE: number = new Date().getDate();

  const todayDebtersData = {
    owner: uid,
    day: CURRENT_DATE,
    quantity: 1,
  };

  if (docSnap.exists()) {
    const docToUpdate = doc(db, "debtersToday", uid ?? "");

    // If The Current Day === DB Date Increase Quantity
    if (CURRENT_DATE === docSnap.data().day) {
      updateDoc(docToUpdate, {
        owner: uid,
        day: CURRENT_DATE,
        quantity: parseInt(docSnap.data().quantity) + 1,
      });
    } else if (CURRENT_DATE !== docSnap.data().day) {
      // Update Doc If The Current Date !== DB Date.
      updateDoc(docToUpdate, todayDebtersData);
    }
  } else {
    setDoc(docRef, todayDebtersData);
  }
};

const Debters = (props: Props) => {
  // Context
  const { selectedLink, setSelectedLink, debters, setDebters } =
    useContext(UserContextAPI);

  const { currentUser } = useContext(AuthContextAPI);

  const defaultFormData: UserData["debter"] = {
    owner: "",
    id: "",
    name: "",
    job: "",
    debt: 0,
    mobile: "",
  };

  // Firebase
  const collectionRef = collection(db, "debters");
  const ownerQuery = query(
    collectionRef,
    where("owner", "==", currentUser?.uid ?? "")
  );

  // Refs
  const REF_search_input = useRef<HTMLInputElement>(null!);
  const REF_debt_input = useRef<HTMLInputElement>(null!);

  // Stats
  const [clonedDebters, setClonedDebters] = useState<UserData["debter"][]>([]);
  const [prevDebt, setPrevDebt] = useState<number | null>(null);
  const [searchFilled, setSearchFilled] = useState<boolean>(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isAddBoxShowed, setIsAddBoxShowed] = useState<boolean>(false);
  const [sortingDirection, setSortingDirection] = useState<string>(
    SortingDirection.UNSORTED
  );
  const [debterIdToEdit, setDebterIdToEdit] = useState<string>("");
  const [debterNotFound, setDebterNotFound] = useState<boolean>(false);
  const [errorOnAdd, setErrorOnAdd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const nameInp = document.querySelector<HTMLInputElement>("#name"),
      jobInp = document.querySelector<HTMLInputElement>("#job"),
      debtInp = document.querySelector<HTMLInputElement>("#debt"),
      mobileInp = document.querySelector<HTMLInputElement>("#mobile");

    e.preventDefault();

    if (!debters) return;

    if (nameInp && jobInp && debtInp && mobileInp) {
      if (!debterIdToEdit) {
        formData.owner = currentUser?.uid ?? "";

        // Add New Debter
        addDoc(collectionRef, formData)
          .then((data) => {
            return { ...data };
          })
          .catch((err) => {
            setErrorOnAdd(true);
          });

        getDebters();

        // If The New Debter Taked From Our Shop From the 1st Time
        if (parseInt(debtInp.value) !== 0) {
          // Set Latest Debter
          settingDebtersToday(currentUser?.uid ?? "");
          settingLatestDebter(
            currentUser?.uid ?? "",
            formData.name,
            formData.job
          );
        }
        resetInput();
        setIsAddBoxShowed(false);
        return;
      }

      // Update Debter
      const docToUpdate = doc(db, "debters", debterIdToEdit);
      updateDoc(docToUpdate, {
        owner: currentUser?.uid ?? "",
        id: debterIdToEdit,
        name: nameInp.value,
        job: jobInp.value,
        debt: parseInt(debtInp.value) || 0,
        mobile: mobileInp.value,
      });

      const prevDebterDebt: number | undefined = debters.find(
        (debter) => debter.id === debterIdToEdit
      )?.debt;

      getDebters();

      if (REF_search_input.current) {
        // Prevent Search Result When Editing.
        REF_search_input.current.value = "";
        setSearchFilled(false);
      }

      // If The Debter Taked More Items From Our Shop
      if (prevDebterDebt && parseInt(debtInp.value) > prevDebterDebt) {
        // Set The Latest Debter

        // incDebtersToday();
        settingDebtersToday(currentUser?.uid ?? "");
        settingLatestDebter(
          currentUser?.uid ?? "",
          nameInp.value,
          jobInp.value
        );
      } else if (prevDebterDebt && parseInt(debtInp.value) < prevDebterDebt) {
        // Here We Make The Last Motive

        const docRef = doc(db, "lastMotive", debterIdToEdit);
        const docSnap = await getDoc(docRef);

        const motiveData = {
          owner: currentUser?.uid ?? "",
          name: nameInp.value,
          prevDebt: prevDebterDebt,
          debt: parseInt(debtInp.value),
        };

        if (docSnap.exists()) {
          const docToUpdate = doc(db, "lastMotive", debterIdToEdit);
          updateDoc(docToUpdate, motiveData);
        } else {
          setDoc(docRef, motiveData);
        }
      }
    }

    setIsAddBoxShowed(false);
    setDebterIdToEdit("");
    setPrevDebt(null);

    setFormData(defaultFormData);
    resetInput();
  };

  const getDebters = (): void => {
    onSnapshot(ownerQuery, (resp) => {
      const debtersData = resp.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      setIsLoading(false);
      setDebters(debtersData as UserData["debter"][]);
      setClonedDebters(debtersData as UserData["debter"][]);
    });
  };

  const handleClosingBox = (): void => {
    setIsAddBoxShowed(false);
    setFormData(defaultFormData);
    setPrevDebt(null);

    resetInput();
  };

  const setValues = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (errorOnAdd) setErrorOnAdd(false);
    if (e.target.id === "debt" && e.target.value === "")
      e.target.value = `${0}`;

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const resetSearch = (): void => {
    if (REF_search_input.current) {
      REF_search_input.current.value = "";

      setSearchFilled(false);
      setDebterNotFound(false);
      setClonedDebters([...(debters ?? [])]);
    }
  };

  const editDebter = (debter: UserData["debter"]): void => {
    resetInput(debter.name, debter.job, `${debter.debt}`, debter.mobile);

    setPrevDebt(debter.debt);
    setIsAddBoxShowed(true);
    setDebterIdToEdit(debter.id);
  };

  const delDebter = (id: string): void => {
    if (!debters) return;

    if (REF_search_input.current) {
      // Prevent Search Result When Deleting.
      REF_search_input.current.value = "";

      setSearchFilled(false);

      const docToDelete = doc(db, "debters", id);
      deleteDoc(docToDelete);

      getDebters();
    }
  };

  const searchForDebter = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      currentTarget: { value },
    } = e;

    setDebterNotFound(false);

    if (value.length === 0) {
      setSearchFilled(false);
      resetSearch();
      setClonedDebters([...(debters ?? [])]);
      return;
    }
    if (value.length >= 1) setSearchFilled(true);

    if (!debters) return;

    const searchValue: string = value.toLowerCase();

    if (debters.find(({ name }) => name.includes(searchValue))) {
      setClonedDebters(
        debters.filter(({ name }) => name.includes(searchValue))
      );
    } else if (debters.find(({ job }) => job.includes(searchValue))) {
      setClonedDebters(debters.filter(({ job }) => job.includes(searchValue)));
    } else if (debters.find(({ mobile }) => mobile.includes(searchValue))) {
      setClonedDebters(
        debters.filter(({ mobile }) => mobile.includes(searchValue))
      );
    } else {
      setDebterNotFound(true);
    }
  };

  const resetInput = (
    name?: string,
    job?: string,
    debt?: string,
    mobile?: string
  ): void => {
    const nameInp = document.querySelector<HTMLInputElement>("#name"),
      jobInp = document.querySelector<HTMLInputElement>("#job"),
      debtInp = document.querySelector<HTMLInputElement>("#debt"),
      mobileInp = document.querySelector<HTMLInputElement>("#mobile");

    if (nameInp && jobInp && debtInp && mobileInp) {
      nameInp.value = name ?? "";
      jobInp.value = job ?? "";
      debtInp.value = debt ? (parseInt(debt) === 0 ? "" : debt) : "";
      mobileInp.value = mobile ?? "";
    }
  };

  const preventStringInDebt = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    const { key } = e;

    if (REF_debt_input.current) {
      if (REF_debt_input.current.value.includes(".")) {
        if (isNaN(parseInt(key))) e.preventDefault();
      }
    }

    if (key !== ".") {
      if (isNaN(parseInt(key))) {
        e.preventDefault();
      }
    }
  };

  const addDebter = (): void => {
    // Here We Make The Post Request To The Server
    setDebterIdToEdit("");
    setIsAddBoxShowed(true);
  };

  const sortingByName = (): void => {
    if (!debters) return;
    if (searchFilled) return;

    if (sortingDirection === SortingDirection.UNSORTED) {
      setClonedDebters(
        clonedDebters.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          } else {
            return -1;
          }
        })
      );

      setSortingDirection(SortingDirection.ACENDING);
    } else if (sortingDirection === SortingDirection.ACENDING) {
      setClonedDebters(
        clonedDebters.sort((a, b) => {
          if (a.name > b.name) {
            return -1;
          } else {
            return 1;
          }
        })
      );

      setSortingDirection(SortingDirection.DECENDING);
    } else if (sortingDirection === SortingDirection.DECENDING) {
      setClonedDebters([...debters]);

      setSortingDirection(SortingDirection.UNSORTED);
    }
  };

  const sortingByJob = (): void => {
    if (!debters) return;
    if (searchFilled) return;

    if (sortingDirection === SortingDirection.UNSORTED) {
      setClonedDebters(
        clonedDebters.sort((a, b) => {
          if (a.job > b.job) {
            return 1;
          } else {
            return -1;
          }
        })
      );

      setSortingDirection(SortingDirection.ACENDING);
    } else if (sortingDirection === SortingDirection.ACENDING) {
      setClonedDebters(
        clonedDebters.sort((a, b) => {
          if (a.job > b.job) {
            return -1;
          } else {
            return 1;
          }
        })
      );

      setSortingDirection(SortingDirection.DECENDING);
    } else if (sortingDirection === SortingDirection.DECENDING) {
      setClonedDebters([...debters]);

      setSortingDirection(SortingDirection.UNSORTED);
    }
  };

  const sortingByDebt = (): void => {
    if (!debters) return;
    if (searchFilled) return;

    if (sortingDirection === SortingDirection.UNSORTED) {
      setClonedDebters(clonedDebters.sort((a, b) => b.debt - a.debt));

      setSortingDirection(SortingDirection.ACENDING);
    } else if (sortingDirection === SortingDirection.ACENDING) {
      setClonedDebters(clonedDebters.sort((a, b) => a.debt - b.debt));

      setSortingDirection(SortingDirection.DECENDING);
    } else if (sortingDirection === SortingDirection.DECENDING) {
      setClonedDebters([...debters]);

      setSortingDirection(SortingDirection.UNSORTED);
    }
  };

  const renderDebters = (): JSX.Element[] => {
    const notProvidedMsg: string = "Not Provided";

    return clonedDebters.map((debter) => {
      const { id, name, job, mobile, debt } = debter;
      return (
        <tr key={id} className={`debters-list__body__debter capitalize`}>
          <td className="name">{name || notProvidedMsg}</td>
          <td className="mobile">{mobile || notProvidedMsg}</td>
          <td className="job">{job || notProvidedMsg}</td>
          <td className="debt">{debt || 0}</td>
          <td className="operations">
            <img
              src="/images/edit.svg"
              alt="Edit Debter"
              className=""
              onClick={() => editDebter(debter)}
            />
            <img
              src="/images/delete.svg"
              alt="Delete Debter"
              className=""
              onClick={() => delDebter(id)}
            />
          </td>
        </tr>
      );
    });
  };

  const listDebters = (): JSX.Element => {
    if (isLoading) return <Loader currentPage={selectedLink} />;

    if (!debters?.length)
      return <div className="not-found-err">No Debters Founded.</div>;

    return (
      <table className="debters-list">
        <thead className="debters-list__head text-left capitalize">
          <tr>
            <th className="cursor-pointer" onClick={sortingByName}>
              <span className="txt">
                name
                <img
                  src="/images/customers-page/sort-a-z.svg"
                  alt="Sort Icon A TO Z"
                />
              </span>
            </th>
            <th>mobile</th>
            <th className="cursor-pointer" onClick={sortingByJob}>
              <span className="txt">
                job
                <img
                  src="/images/customers-page/sort-a-z.svg"
                  alt="Sort Icon A TO Z"
                />
              </span>
            </th>
            <th className="cursor-pointer" onClick={sortingByDebt}>
              <span className="txt">
                debt
                <img
                  src="/images/customers-page/sort-1-9.svg"
                  alt="Sort Icon A TO Z"
                />
              </span>
            </th>
            <th className="text-center">operations</th>
          </tr>
        </thead>
        <tbody className="debters-list__body">{renderDebters()}</tbody>
      </table>
    );
  };

  const returnPrevDebt = (): number | string => {
    if (prevDebt) return prevDebt;
    return "";
  };

  useEffect(() => {
    editClassOnMount(
      ".main-nav__functions .debters",
      setSelectedLink,
      "debters"
    );
    setClonedDebters([...(debters ?? [])]);
    getDebters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="main-section__customers">
      {!isLoading && (
        <>
          {debters?.length ? (
            <header className="main-section__customers__head mb-5">
              <div className="status text-white">
                <p className="status__debters capitalize">
                  total debters: <span>{debters && debters.length}</span>
                </p>
                <p className="status__debt capitalize">
                  total debt: <span>{totalDebt(debters)}</span>
                </p>
              </div>
            </header>
          ) : (
            ""
          )}
          <div className="btns-and-search flex justify-between items-center mb-4">
            <div className="btns-and-search__btns text-white flex gap-2">
              <button className="violet-btn capitalize" onClick={addDebter}>
                add new debter
              </button>
            </div>
            {debters?.length ? (
              <div
                className="btns-and-search__search flex gap-2 bg-light-black"
                onClick={() =>
                  REF_search_input.current && REF_search_input.current.focus()
                }
              >
                {searchFilled ? (
                  <img
                    src="/images/reset.svg"
                    alt="Reset Icon"
                    className="w-[20px] cursor-pointer"
                    onClick={resetSearch}
                  />
                ) : (
                  <img
                    src="/images/search-violet.svg"
                    alt="Search Icon"
                    className="w-[20px]"
                  />
                )}
                <input
                  type="text"
                  placeholder="Search For User..."
                  className=""
                  ref={REF_search_input}
                  onChange={searchForDebter}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </>
      )}
      <div className="debters-list-container">
        {!debterNotFound ? (
          listDebters()
        ) : (
          <div className="not-found-err">Debter Not Found</div>
        )}
      </div>
      <div
        className={`add-new-sched transition-opacity ${
          !isAddBoxShowed
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}
      >
        <form
          action="#"
          className="add-new-debter__form add-new-box text-white flex flex-col gap-2"
          onSubmit={handleFormSubmit}
        >
          <div className="img-wrapper">
            <h4 className="title">
              {debterIdToEdit ? "edit debter" : "add new debter"}
            </h4>
            <img
              src="/images/customers-page/close-icon.svg"
              alt="Close Icon"
              className="img-wrapper__close-icon"
              onClick={handleClosingBox}
            />
          </div>

          <div className="inputs capitalize flex gap-2 items-center">
            <div className="inputs__one">
              <label htmlFor="name">
                full name
                <input
                  type="text"
                  name="debter-name"
                  id="name"
                  required
                  autoFocus={true}
                  onChange={setValues}
                  tabIndex={1}
                />
              </label>
              <label htmlFor="job">
                job name
                <input
                  type="text"
                  name="debter-job"
                  id="job"
                  onChange={setValues}
                  tabIndex={3}
                />
              </label>
            </div>
            <div className="inputs__two">
              <label htmlFor="debt">
                <div className="head w-full flex justify-between items-center">
                  <span>debt</span>
                  <span className="font-bold">{returnPrevDebt()}</span>
                </div>
                <input
                  type="text"
                  name="debter-debt"
                  id="debt"
                  onChange={setValues}
                  onKeyPress={preventStringInDebt}
                  tabIndex={2}
                />
              </label>
              <label htmlFor="mobile">
                mobile
                <input
                  type="text"
                  name="debter-mobile"
                  id="mobile"
                  onChange={setValues}
                  tabIndex={4}
                />
              </label>
            </div>
          </div>
          {errorOnAdd && (
            <div className="user-err">Error Aqquired, Try Again</div>
          )}
          <div className="btn-wrapper">
            <button className="btn-wrapper__btn violet-btn">
              {debterIdToEdit ? "edit debter" : "add debter"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Debters;
