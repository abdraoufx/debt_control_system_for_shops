import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useContext, useEffect } from "react";
import { AuthContextAPI } from "../../context/auth/AuthContext";
import { UserContextAPI } from "../../context/UserContext";
import { db } from "../../firebase/firebase-config";
import "../../sass/pages/_main-section.scss";
import { UserContextType, UserData } from "../../types/userContextTypes";
import Analytics from "../mainSection_components/Analytics";
import Calculator from "../mainSection_components/Calculator";
import { editClassOnMount } from "./functions/editClassOnMount";

type Props = {};

export const totalDebt = (arrOfDebters: UserContextType["debters"]): number => {
  if (!arrOfDebters) return 0;

  const total: number = arrOfDebters.reduce(function (acc, { debt }) {
    return acc + parseInt(`${debt}`);
  }, 0);

  return total;
};

const Dashboard = (props: Props) => {
  // Context
  const { setSelectedLink, debters, debtersToday, setDebtersToday } =
    useContext(UserContextAPI);

  const { currentUser } = useContext(AuthContextAPI);

  // Firebase
  const debtersTodayDbRef = collection(db, "debtersToday");

  const getTodayDebters = (): void => {
    const ownerQuery = query(
      debtersTodayDbRef,
      where("owner", "==", currentUser?.uid ?? "")
    );

    onSnapshot(ownerQuery, (resp) => {
      const debtersTodayData = resp.docs.map((doc) => {
        return { ...doc.data() };
      });

      setDebtersToday(debtersTodayData as UserData["debertsToday"][]);
    });
  };

  const renderTodayDebters = (): number => {
    if (!debtersToday?.length) return 0;

    return debtersToday[0].quantity;
  };

  useEffect(() => {
    editClassOnMount(
      ".main-nav__functions .dashboard",
      setSelectedLink,
      "dashboard"
    );
    getTodayDebters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="all-cards flex justify-between pb-2 border-b border-b-white flex-wrap gap-3 sm:gap-0">
        <div className="all-cards__total-debters-card p-3 bg-blue">
          <div className="text-side">
            <span className="number">{debters && debters.length}</span>
            <span className="txt capitalize">total debters</span>
          </div>
          <img
            src="/images/cards_images/total_debters.png"
            alt="Total Debters Icon"
          />
        </div>
        <div className="all-cards__total-debt-card p-3 bg-dark-violet">
          <div className="text-side">
            <span className="number">{totalDebt(debters)}</span>
            <span className="txt capitalize">total debt</span>
          </div>
          <img
            src="/images/cards_images/total_debt.png"
            alt="Total Debt Icon"
          />
        </div>
        <div className="all-cards__num-of-debters-today-card p-3 bg-light-green">
          <div className="text-side">
            <span className="number">{renderTodayDebters()}</span>
            <span className="txt capitalize">debters today</span>
          </div>
          <img
            src="/images/cards_images/num_of_debters.png"
            alt="Number Of Debters Today Icon"
          />
        </div>
      </div>
      <section className="main-section__main flex justify-between items-center pt-2 pb-1 h-full md:pb-0">
        <Analytics />
        <Calculator />
      </section>
    </>
  );
};

export default Dashboard;
