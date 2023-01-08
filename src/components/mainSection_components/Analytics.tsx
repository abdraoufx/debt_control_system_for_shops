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
import {
  LastMotive,
  LatestDebter,
  UserData,
} from "../../types/userContextTypes";
import {
  settingDebtersToday,
  settingLatestDebter,
} from "../navBar_components/Debters";

interface TopDebter {
  name: string | undefined;
  job: string | undefined;
}

interface ClosestSalary {
  jobs: (string | null)[];
  date: string | undefined;
  daysLeft: number;
  nextOrCurrentMonth: "This Month" | "Next Month";
}

interface NextCommedity {
  id: string;
  name: string;
  day: string;
}

type Props = {};

const Analytics = (props: Props) => {
  const defaultFormData: UserData["debter"] = {
    owner: "",
    id: "",
    name: "",
    job: "",
    debt: 0,
    mobile: "",
  };

  // Context
  const {
    debters,
    setDebters,
    latestDebter,
    lastMotive,
    setLastMotive,

    setLatestDebter,

    notes,
    setNotes,

    schedueles,
    setSchedueles,

    commedities,
    setCommedities,
  } = useContext(UserContextAPI);

  const { currentUser } = useContext(AuthContextAPI);

  // Firebase
  const debtersDbRef = collection(db, "debters");
  const notesDbRef = collection(db, "notes");
  const commeditiesDbRef = collection(db, "commedities");
  const schedsDbRef = collection(db, "schedueles");
  const lastMotiveDbRef = collection(db, "lastMotive");
  const latestDebterDbRef = collection(db, "latestDebter");

  // Debters States
  const [topDebter, setTopDebter] = useState<TopDebter>();
  const [isAddBoxShowed, setIsAddBoxShowed] = useState<boolean>();
  const [formData, setFormData] = useState(defaultFormData);
  const [ismotiveBoxShowed, setIsMotiveBoxShowed] = useState<boolean>(false);
  const [errorOnAdd, setErrorOnAdd] = useState<boolean>(false);

  // Notes States
  const [isLatestNoteBoxShowed, setIsLatestNoteBoxShowed] =
    useState<boolean>(false);

  // Salary Scheduele States
  const [isSalaryBoxShowed, setIsSalaryBoxShowed] = useState<boolean>(false);
  const [closestSalaries, setClosestSalaries] = useState<ClosestSalary | null>(
    null
  );
  const [noSalaryErr, setNoSalaryErr] = useState<string>("");

  // Commedities Satates
  const [nexCommedities, setNextCommedities] = useState<NextCommedity[] | null>(
    null
  );

  const returnValues = (value: string | null | undefined) => {
    const ERR_MSG = "Not Provided.";

    if (!value) return ERR_MSG;
    return value;
  };

  // Objects
  const debtFncsObj = {
    debtInput: useRef<HTMLInputElement>(null),

    getTopDebter: () => {
      if (!debters) return;

      const debts: number[] = debters.map(({ debt }) => parseInt(`${debt}`));

      const foundedDebter: UserData["debter"] | undefined = debters.find(
        (debter) => parseInt(`${debter.debt}`) === Math.max(...debts)
      );

      setTopDebter({
        name: foundedDebter?.name,
        job: foundedDebter?.job,
      });
    },

    preventStringInDebt: (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;

      if (debtInput.current) {
        if (debtInput.current.value.includes(".")) {
          if (isNaN(parseInt(key))) e.preventDefault();
        }
      }

      if (key !== ".") {
        if (isNaN(parseInt(key))) {
          e.preventDefault();
        }
      }
    },

    handleFormSubmit: async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (formData.debt !== 0) {
        settingDebtersToday(currentUser?.uid ?? "");

        settingLatestDebter(
          currentUser?.uid ?? "",
          formData.name,
          formData.job
        );
      }

      formData.owner = currentUser?.uid ?? "";
      // Add New Debter
      addDoc(debtersDbRef, formData)
        .then((data) => {
          return { ...data };
        })
        .catch((err) => {
          setErrorOnAdd(true);
        });

      getDebters();
      setFormData(defaultFormData);
      resetInput();
      setIsAddBoxShowed(false);
    },

    handleClosingBox: (): void => {
      setIsAddBoxShowed(false);
      setFormData(defaultFormData);

      resetInput();
    },

    resetInput: (
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
        debtInp.value = debt ?? "";
        mobileInp.value = mobile ?? "";
      }
    },

    setValues: (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (errorOnAdd) setErrorOnAdd(false);

      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    },

    getDebters: (): void => {
      const ownerQuery = query(
        debtersDbRef,
        where("owner", "==", currentUser?.uid ?? "")
      );

      onSnapshot(ownerQuery, (resp) => {
        const debtersData = resp.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        setDebters(debtersData as UserData["debter"][]);
      });
    },

    getLastMotive: (): void => {
      const ownerQuery = query(
        lastMotiveDbRef,
        where("owner", "==", currentUser?.uid ?? "")
      );

      onSnapshot(ownerQuery, (resp) => {
        const lastMotiveData = resp.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        if (lastMotiveData.length)
          setLastMotive(lastMotiveData as LastMotive[]);
      });
    },

    getLatestDebter: (): void => {
      const ownerQuery = query(
        latestDebterDbRef,
        where("owner", "==", currentUser?.uid ?? "")
      );

      onSnapshot(ownerQuery, (resp) => {
        const latestDebterData = resp.docs.map((doc) => {
          return { ...doc.data() };
        });

        if (latestDebterData.length)
          setLatestDebter(latestDebterData as LatestDebter[]);
      });
    },
    renderLatestDebter: (): JSX.Element => {
      return (
        <>
          <h3 className="lastest-debter__title capitalize">latest debter:</h3>
          <span className="lastest-debter__name capitalize">
            name:{" "}
            <span className="font-bold">
              {returnValues(latestDebter && latestDebter[0]?.name)}
            </span>
          </span>
          <span className="lastest-debter__job capitalize">
            job:{" "}
            <span className="font-bold">
              {returnValues(latestDebter && latestDebter[0]?.job)}
            </span>
          </span>
        </>
      );
    },

    renderMotiveData: (): JSX.Element | JSX.Element[] => {
      if (!lastMotive?.length) {
        return (
          <span className="err font-bold">
            no motive, dont' be shy from people
          </span>
        );
      }

      return lastMotive.map(({ name, debt, prevDebt, id }) => {
        return (
          <span className="last-motive-msg capitalize" key={id}>
            Last Motive Is{" "}
            <span className="last-motive-msg__name font-bold capitalize">
              {name}{" "}
            </span>
            with debt{" "}
            <span className="last-motive-msg__prevDebt font-bold">
              {prevDebt}{" "}
            </span>
            and he payed{" "}
            <span className="last-motive-msg__currDebt font-bold">
              {prevDebt - debt}
            </span>
            . <br /> now his debt is{" "}
            <span className="last-motive-msg__debt font-bold">{debt}</span>.
          </span>
        );
      });
    },
  };

  const noteFncsObj = {
    checkNote: (note: UserData["note"]) => {
      const docToUpdate = doc(db, "notes", note.id);

      updateDoc(docToUpdate, {
        owner: currentUser?.uid ?? "",
        id: note.id,
        content: note.content,
        checked: !note.checked,
      });
    },

    delNote: (id: string) => {
      const docToDelete = doc(db, "notes", id);
      deleteDoc(docToDelete);

      getNotes();

      setIsLatestNoteBoxShowed(false);
    },

    renderNote: () => {
      if (notes) {
        return [notes[notes.length - 1]].map((note) => {
          return (
            <div
              className="notes-list__note bg-light-black text-white p-2 flex justify-between items-center"
              key={note.id}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name=""
                  id=""
                  className="check-note"
                  checked={note.checked}
                  onChange={() => noteFncsObj.checkNote(note)}
                />
                <p className="txt">{note.content}</p>
              </div>
              <div className="notes-list__note__icons">
                <img
                  src="/images/delete.svg"
                  alt="Delete Debter"
                  onClick={() => noteFncsObj.delNote(note.id)}
                />
              </div>
            </div>
          );
        });
      }
      return <div className="no-note-err text-center">No Note Provided</div>;
    },

    getNotes: () => {
      const ownerQuery = query(
        notesDbRef,
        where("owner", "==", currentUser?.uid ?? "")
      );

      onSnapshot(ownerQuery, (resp) => {
        const notesData = resp.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        setNotes(notesData as UserData["note"][]);
      });
    },
  };

  const closestSalaryObj = {
    getClosestSalarySched: (): void => {
      const currentDay: number = new Date().getDate();

      // MAX_MONTH_DAY => Equals To The Last Day Of The Current Month
      const MAX_MONTH_DAY = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).getDate();

      let localDaysLeft: number = 0;

      if (!schedueles) return;
      setNoSalaryErr("");

      const schedsTimes: number[] = schedueles?.map((sched) =>
        parseInt(sched.time)
      );

      if (schedueles.find(({ time }) => parseInt(time) === currentDay)) {
        // Means That One Of The Times Is Equals To Today
        const salary = schedueles.find(
          ({ time }) => parseInt(time) === currentDay
        );

        const closestJobs: (string | null)[] = schedueles.map(
          ({ time, jobName }) => {
            if (parseInt(time) === currentDay) {
              return jobName;
            }
            return null;
          }
        );

        localDaysLeft = 0;

        setClosestSalaries({
          jobs: closestJobs,
          date: salary?.time,
          daysLeft: localDaysLeft,
          nextOrCurrentMonth: "This Month",
        });
      } else if (schedueles.find(({ time }) => parseInt(time) !== currentDay)) {
        for (let i = currentDay; i <= MAX_MONTH_DAY; i++) {
          if (schedueles.find(({ time }) => parseInt(time) === i)) {
            // Means That We Need To Increase The Value Until We Found The Day.
            const salary = schedueles.find(({ time }) => parseInt(time) === i);

            const closestJobs: (string | null)[] = schedueles.map(
              ({ time, jobName }) => {
                if (parseInt(time) === i) {
                  return jobName;
                }
                return null;
              }
            );

            setClosestSalaries({
              jobs: closestJobs,
              date: salary?.time,
              daysLeft: localDaysLeft,
              nextOrCurrentMonth: "This Month",
            });

            break;
          } else {
            localDaysLeft++;
            setClosestSalaries({
              jobs: [...(closestSalaries?.jobs ?? [])],
              date: closestSalaries?.date ?? undefined,
              daysLeft: localDaysLeft,
              nextOrCurrentMonth: "This Month",
            });
          }
          if (i === MAX_MONTH_DAY) {
            // Means That We Didn't Found It So We Will Return The Min Day Of The Next Month.
            const salary = schedueles.find(
              ({ time }) => parseInt(time) === Math.min(...schedsTimes)
            );

            const closestJobs: (string | null)[] = schedueles.map(
              ({ time, jobName }) => {
                if (parseInt(time) === Math.min(...schedsTimes)) {
                  return jobName;
                }
                return null;
              }
            );

            localDaysLeft += Math.min(...schedsTimes) - 1; // -1 Means Do Not Include Today

            setClosestSalaries({
              jobs: closestJobs,
              date: salary?.time,
              daysLeft: localDaysLeft,
              nextOrCurrentMonth: "Next Month",
            });
            break;
          }
        }
      }

      setNoSalaryErr("No Salary Schedueles Founded");
    },

    renderClosestSalary: (): JSX.Element => {
      if (closestSalaries) {
        const { date, daysLeft, jobs, nextOrCurrentMonth } = closestSalaries;
        return (
          <span className="closest-salary__msg normal-case">
            The Nearest {jobs.length > 1 ? "Jobs" : "Job"} Will Take The Salary
            at :{" "}
            <span className="date font-bold">
              {date} of {nextOrCurrentMonth}{" "}
            </span>
            is{" "}
            <span className="jobs font-bold capitalize">
              {jobs.length
                ? jobs.map((job, idx) => (
                    <span className="capitalize" key={job}>
                      {idx !== jobs.length - 1 ? `${job}, ` : job}{" "}
                    </span>
                  ))
                : ""}
            </span>
            {daysLeft === 0 ? "" : "After "}
            <span className="days-left font-bold">
              {daysLeft === 0
                ? "Today"
                : `${daysLeft > 1 ? daysLeft + " Days" : daysLeft + " Day"}`}
              .
            </span>
          </span>
        );
      }

      return <span className="font-bold">{noSalaryErr}.</span>;
    },

    getSalaryScheds: (): void => {
      const ownerQuery = query(
        schedsDbRef,
        where("owner", "==", currentUser?.uid ?? "")
      );

      onSnapshot(ownerQuery, (resp) => {
        const schedData = resp.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        setSchedueles(schedData as UserData["salarySched"][]);
      });
    },
  };

  const commeditiesFncsObj = {
    getNextCommedities: (): void => {
      const DAYS_LIST: string[] = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];

      const currentDay: string = DAYS_LIST[new Date().getDay()];

      if (commedities?.find(({ day }) => day.toLowerCase() === currentDay)) {
        // Means That Today A Commedity Will Come
        setNextCommedities(
          commedities.filter(({ day }) => day.toLowerCase() === currentDay)
        );
      } else if (
        commedities?.find(({ day }) => day.toLowerCase() !== currentDay)
      ) {
        // Here We Need To Icrease And Index Until We Found The Day

        const DAYS_LIST_MAX_IND: number = DAYS_LIST.length - 1;

        let CURRENT_DAY_IDX = new Date().getDay();

        // I Used While Loop Because For Loop Can't See Next Week Days
        while (
          commedities.find(
            // eslint-disable-next-line no-loop-func
            ({ day }) => day !== DAYS_LIST[CURRENT_DAY_IDX]
          )
        ) {
          if (
            commedities.find(
              // eslint-disable-next-line no-loop-func
              ({ day }) => day === DAYS_LIST[CURRENT_DAY_IDX]
            )
          ) {
            setNextCommedities(
              commedities.filter(
                // eslint-disable-next-line no-loop-func
                ({ day }) => day === DAYS_LIST[CURRENT_DAY_IDX]
              )
            );
            break;
          }

          if (CURRENT_DAY_IDX === DAYS_LIST_MAX_IND) {
            CURRENT_DAY_IDX = 0;
          }
          CURRENT_DAY_IDX++;
        }
      }
    },

    renderNextCommedities: (): JSX.Element | undefined => {
      console.log(nexCommedities);

      if (!nexCommedities) return;

      return (
        <>
          <span className="item capitalize text-center">
            the next {nexCommedities.length === 1 ? "item" : "items"} will come
            is{" "}
            {nexCommedities.map((nCmd, idx) => {
              return (
                <span key={nCmd.id} className="font-bold capitalize">
                  {nCmd.name}
                  {idx !== nexCommedities.length - 1 && ", "}
                </span>
              );
            })}
            .
          </span>
          <div className="comes-at capitalize text-center">
            comes at{" "}
            <span className="comes-at__day font-bold capitalize">
              {nexCommedities.length && nexCommedities[0].day}
            </span>
          </div>
        </>
      );
    },

    getCommedities: (): void => {
      const ownerQuery = query(
        commeditiesDbRef,
        where("owner", "==", currentUser?.uid ?? "")
      );

      onSnapshot(ownerQuery, (resp) => {
        const commeditiesData = resp.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        setCommedities(commeditiesData as UserData["commedity"][]);
      });
    },
  };

  const {
    handleFormSubmit,
    handleClosingBox,
    preventStringInDebt,
    resetInput,
    setValues,

    getDebters,
    getTopDebter,
    getLatestDebter,

    renderLatestDebter,
    renderMotiveData,
    getLastMotive,

    debtInput,
  } = debtFncsObj;

  const { renderNote, getNotes } = noteFncsObj;

  const { getClosestSalarySched, renderClosestSalary, getSalaryScheds } =
    closestSalaryObj;

  const { renderNextCommedities, getNextCommedities, getCommedities } =
    commeditiesFncsObj;

  useEffect(() => {
    getTopDebter();
    getClosestSalarySched();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debters]);

  useEffect(() => {
    getNextCommedities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commedities]);

  useEffect(() => {
    getNextCommedities();
    getDebters();
    getLatestDebter();
    getSalaryScheds();
    getCommedities();
    getLastMotive();
    getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="analytics flex flex-col justify-between gap-[10px] h-full w-full">
      <div className="analytics__about-customers">
        <h2 className="title capitalize font-semibold">about customers:</h2>
        <div className="debt-status flex justify-between items-center">
          <div className="top-debter font-normal">
            <h3 className="top-debter__title capitalize">top debter:</h3>
            <span className="top-debter__name capitalize">
              name:{" "}
              <span className="font-bold">
                {returnValues(topDebter && topDebter.name)}
              </span>
            </span>
            <span className="top-debter__job capitalize">
              job:{" "}
              <span className="font-bold">
                {returnValues(topDebter && topDebter.job)}
              </span>
            </span>
          </div>
          <div className="lastest-debter font-normal">
            {renderLatestDebter()}
          </div>
        </div>
      </div>
      <div className="analytics__quick-links">
        <h2 className="title capitalize font-semibold">quick links:</h2>
        <div className="buttons flex flex-wrap justify-between gap-1 items-center text-[15px]">
          <div className="buttons__left-side mb-2">
            <button
              className="violet-btn capitalize"
              onClick={() => setIsAddBoxShowed(true)}
            >
              new debter
            </button>
            <button
              className="violet-btn capitalize"
              onClick={() => setIsLatestNoteBoxShowed(true)}
            >
              latest note
            </button>
          </div>
          <div className="buttons__right-side mb-2">
            <button
              className="violet-btn capitalize"
              onClick={() => setIsSalaryBoxShowed(true)}
            >
              closest salary
            </button>
            <button
              className="violet-btn capitalize"
              onClick={() => setIsMotiveBoxShowed(true)}
            >
              last motive
            </button>
          </div>
        </div>
      </div>
      <div className="analytics__possibilites">
        <h2 className="title capitalize font-semibold">possibilites:</h2>
        {!nexCommedities ? (
          <div className="not-found-err pb-4">No Commedities Added.</div>
        ) : (
          renderNextCommedities()
        )}
      </div>
      {/* Read And Write To Data Boxes */}
      <div
        className={`add-new-debter transition-opacity ${
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
            <h4 className="title">add new debter</h4>
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
                debt
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
            <button className="btn-wrapper__btn violet-btn">add debter</button>
          </div>
        </form>
      </div>
      <div
        className={`show-latest-note transition-opacity ${
          !isLatestNoteBoxShowed
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}
      >
        <div className="show-latest-note__container add-new-box text-white flex flex-col gap-2">
          <div className="img-wrapper">
            <h4 className="title">latest Note</h4>
            <img
              src="/images/customers-page/close-icon.svg"
              alt="Close Icon"
              className="img-wrapper__close-icon"
              onClick={() => setIsLatestNoteBoxShowed(false)}
            />
          </div>
          <div className="notes-list">
            {!notes?.length ? (
              <div className="not-found-err">No Notes Found.</div>
            ) : (
              renderNote()
            )}
          </div>
        </div>
      </div>
      <div
        className={`show-last-motive transition-opacity ${
          !ismotiveBoxShowed
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}
      >
        <div className="show-last-motive__container add-new-box text-white flex flex-col gap-2">
          <div className="img-wrapper">
            <h4 className="title">last motive</h4>
            <img
              src="/images/customers-page/close-icon.svg"
              alt="Close Icon"
              className="img-wrapper__close-icon"
              onClick={() => setIsMotiveBoxShowed(false)}
            />
          </div>
          <div className="last-motive capitalize font-normal text-center">
            {renderMotiveData()}
          </div>
        </div>
      </div>
      <div
        className={`show-closest-salary transition-opacity ${
          !isSalaryBoxShowed
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}
      >
        <div className="show-closest-salary__container add-new-box text-white flex flex-col gap-2">
          <div className="img-wrapper">
            <h4 className="title">closest salary</h4>
            <img
              src="/images/customers-page/close-icon.svg"
              alt="Close Icon"
              className="img-wrapper__close-icon"
              onClick={() => setIsSalaryBoxShowed(false)}
            />
          </div>
          <div className="closest-salary font-normal text-center">
            {renderClosestSalary()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
