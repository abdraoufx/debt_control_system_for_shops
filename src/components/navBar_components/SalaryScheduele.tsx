import React, { useContext, useEffect, useRef, useState } from "react";
import { editClassOnMount } from "./functions/editClassOnMount";
import "../../sass/pages/navBar/_Salary-scheduele.scss";
import { UserContextAPI } from "../../context/UserContext";
import { UserData } from "../../types/userContextTypes";
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
import { db } from "../../firebase/firebase-config";
import { AuthContextAPI } from "../../context/auth/AuthContext";
import Loader from "../custom/Loader";

type Props = {};

const SalaryScheduele = (props: Props) => {
  // Context
  const { setSelectedLink, schedueles, setSchedueles } =
    useContext(UserContextAPI);

  const { currentUser } = useContext(AuthContextAPI);

  // Firebase
  const schedsDbRef = collection(db, "schedueles");
  const ownerQuery = query(
    schedsDbRef,
    where("owner", "==", currentUser?.uid ?? "")
  );

  const defaultFormData: UserData["salarySched"] = {
    owner: "",
    id: "",
    jobName: "",
    time: "",
  };

  // States
  const [clonedScheds, setClonedScheds] = useState<UserData["salarySched"][]>(
    []
  );
  const [formData, setFormData] = useState(defaultFormData);
  const [isAddBoxShowed, setIsAddBoxShowed] = useState<boolean>(false);
  const [searchFilled, setSearchFilled] = useState<boolean>(false);
  const [schedIDToEdit, setSchedIDToEdit] = useState<string>("");
  const [schedNotFound, setSchedNotFound] = useState<boolean>(false);
  const [invalidDayMsg, setInvalidDayMsg] = useState<string>("");
  const [errorOnAdd, setErrorOnAdd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Refs
  const searchInp = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!schedueles) return;

    const jobNameInp = document.querySelector<HTMLInputElement>("#jobName"),
      timeInp = document.querySelector<HTMLInputElement>("#time");

    if (jobNameInp && timeInp) {
      const salaryTime: number = parseInt(timeInp.value);

      // Check Whether Is Valid Day Of The Month:
      if (salaryTime === 0 || salaryTime > 31 || isNaN(salaryTime)) {
        setInvalidDayMsg("invalid day try: 1 - 31");
        return;
      }

      if (!schedIDToEdit) {
        // Add Salary Scheduele.
        formData.owner = currentUser?.uid ?? "";

        addDoc(schedsDbRef, formData)
          .then((data) => {
            return { ...data };
          })
          .catch((err) => {
            setErrorOnAdd(true);
          });

        getScheds();
        setIsAddBoxShowed(false);
        return;
      }

      // Update Scheduele
      const docToUpdate = doc(db, "schedueles", schedIDToEdit);
      updateDoc(docToUpdate, {
        owner: currentUser?.uid ?? "",
        id: schedIDToEdit,
        jobName: jobNameInp.value,
        time: timeInp.value,
      });

      getScheds();

      if (searchInp.current) {
        // Prevent Search Result When Editing.
        searchInp.current.value = "";
        setSearchFilled(false);
      }

      setSchedIDToEdit("");

      setFormData(defaultFormData);
      resetInput();
      setIsAddBoxShowed(false);
    }
  };

  const getScheds = (): void => {
    setIsLoading(true);

    onSnapshot(ownerQuery, (resp) => {
      const schedData = resp.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      setIsLoading(false);
      setSchedueles(schedData as UserData["salarySched"][]);
      setClonedScheds(schedData as UserData["salarySched"][]);
    });
  };

  const addNewSched = (): void => {
    setSchedIDToEdit("");
    setIsAddBoxShowed(true);
  };

  const setValues = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.id === "time") setInvalidDayMsg("");
    if (schedNotFound) setSchedNotFound(false);
    if (errorOnAdd) setErrorOnAdd(false);

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClosingBox = (): void => {
    setIsAddBoxShowed(false);
    setFormData(defaultFormData);

    resetInput();
  };

  const searchForSched = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      target: { value },
    } = e;

    setSchedNotFound(false);

    if (value.length === 0) {
      setSearchFilled(false);
      resetSearch();
      setSchedNotFound(false);
    }
    if (value.length > 0) setSearchFilled(true);

    if (!schedueles) return;

    const searchValue: string = value.toLowerCase();

    if (schedueles.find(({ jobName }) => jobName.includes(searchValue))) {
      setClonedScheds(
        clonedScheds.filter(({ jobName }) => jobName.includes(searchValue))
      );
    } else {
      setSchedNotFound(true);
    }
  };

  const resetSearch = (): void => {
    if (searchInp.current) {
      searchInp.current.value = "";

      setSearchFilled(false);
      setSchedNotFound(false);
      setClonedScheds([...(schedueles ?? [])]);
    }
  };

  const delSched = (id: string): void => {
    if (!schedueles) return;

    if (searchInp.current) {
      // Prevent Search Result When Deleting.
      searchInp.current.value = "";

      setSearchFilled(false);

      const docToDelete = doc(db, "schedueles", id);
      deleteDoc(docToDelete);

      getScheds();
    }
  };

  const editSched = (scheduele: UserData["salarySched"]): void => {
    if (!schedueles) return;

    resetInput(scheduele.jobName, scheduele.time);

    setIsAddBoxShowed(true);
    setSchedIDToEdit(scheduele.id);
  };

  const renderScheds = (): JSX.Element[] | JSX.Element => {
    return clonedScheds.map((sched) => {
      const { jobName, time, id } = sched;

      const timeWithZeroBefore = parseInt(time) < 10 ? `0${time}` : time;

      return (
        <tr key={id}>
          <td>{jobName}</td>
          <td>{timeWithZeroBefore} of each month</td>
          <td className="operations">
            <img
              src="/images/edit.svg"
              alt="Edit Debter"
              onClick={() => editSched(sched)}
            />
            <img
              src="/images/delete.svg"
              alt="Delete Debter"
              onClick={() => delSched(id)}
            />
          </td>
        </tr>
      );
    });
  };

  const listScheds = (): JSX.Element => {
    if (isLoading) return <Loader currentPage="Salary Schedueles" />;

    if (!schedueles?.length)
      return <div className="not-found-err">No Schedueles Founded</div>;

    return (
      <div className="list-scheds">
        <table>
          <thead className="list-scheds__head">
            <tr>
              <th>Job Name</th>
              <th>Time</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody className="list-scheds__body">{renderScheds()}</tbody>
        </table>
      </div>
    );
  };

  const resetInput = (jobNameValue?: string, timeValue?: string) => {
    const jobNameInp = document.querySelector<HTMLInputElement>("#jobName"),
      timeInp = document.querySelector<HTMLInputElement>("#time");

    if (jobNameInp && timeInp) {
      jobNameInp.value = jobNameValue ?? "";
      timeInp.value = timeValue ?? "";
    }
  };

  useEffect(() => {
    editClassOnMount(
      ".main-nav__functions .salary-scheduele",
      setSelectedLink,
      "salary scheduele"
    );
    getScheds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="main-section__salary-scheduele">
      {!isLoading && (
        <div className="btns-and-search">
          <div className="btns-and-search__btns">
            <button
              className="violet-btn text-white rounded-full px-4 py-1 mt-2"
              onClick={addNewSched}
            >
              Add New Scheduele
            </button>
          </div>
          {schedueles?.length ? (
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
                onChange={searchForSched}
              />
            </div>
          ) : (
            ""
          )}
        </div>
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
            <h4 className="title">
              {schedIDToEdit ? "edit scheduele" : "add new scheduele"}
            </h4>
            <img
              src="/images/customers-page/close-icon.svg"
              alt="Close Icon"
              className="img-wrapper__close-icon"
              onClick={handleClosingBox}
            />
          </div>
          <div className="inputs capitalize flex justify-between items-center">
            <div className="inputs__one">
              <label htmlFor="jobName">job name</label>
              <input
                type="text"
                name="sched-job-name"
                id="jobName"
                required
                onChange={setValues}
              />
            </div>
            <div className="inputs__two">
              <label htmlFor="time">Day Of The Month</label>
              <input
                type="text"
                name="sched-time"
                id="time"
                required
                onChange={setValues}
              />
            </div>
          </div>
          {invalidDayMsg && (
            <div className="text-center text-err-red mb-2">{invalidDayMsg}</div>
          )}
          {errorOnAdd && (
            <div className="user-err">Error Aqquired, Try Again.</div>
          )}
          <div className="btn-wrapper">
            <button className="btn-wrapper__btn violet-btn">
              {schedIDToEdit ? "edit scheduele" : "add scheduele"}
            </button>
          </div>
        </form>
      </div>
      {!schedNotFound ? (
        listScheds()
      ) : (
        <div className="not-found-err">Scheduele Not Found.</div>
      )}
    </section>
  );
};

export default SalaryScheduele;
