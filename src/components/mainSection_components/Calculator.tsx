import React, { useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { UserContextAPI } from "../../context/UserContext";
import { editClassOnMount } from "../navBar_components/functions/editClassOnMount";

type Props = {};

/* 
  * TODO:
  1 => Make The Text Of The Clicked Btn Added To The Input. DONE:
  2 => Do The Logic. {
    1 => Make The Logic When Pressing Buttons
          ==> Make It With {firstValue, ScndValue, waitingForScndOperand} => FAILED:
          ==> MAKE It With Getting Array Of Nums And Operators And Do The Logic On Them DONE:
    2 ==> Make The Logic When Focusing On The Screen And Pressing Keyboard Buttons DONE:
  }
*/

interface CalculatorInt {
  isResultDisplayed: boolean;
  updateDisplay: (type: 0 | 1, value: string) => void;
  clickingNums: (value: number | string) => void;
  clickingOperators: (value: string) => void;
  showResult: () => void;
  reset: () => void;
  del: () => void;
}

const Calculator = (props: Props) => {
  const { setSelectedLink } = useContext(UserContextAPI);

  const url = useLocation();
  const isMain = url.pathname === "/calculator";

  const btnsArr: (string | number)[] = [
    7,
    8,
    9,
    "del",
    4,
    5,
    6,
    "+",
    1,
    2,
    3,
    "-",
    ".",
    0,
    "÷",
    "×",
    "reset",
    "=",
  ];

  const screen = useRef<HTMLInputElement>(null);

  const calculator: CalculatorInt = {
    isResultDisplayed: false,

    updateDisplay: (type: 0 | 1, value: string | number) => {
      // 0 => Means Overwrite, 1 => Means Append To It
      if (screen.current) {
        if (!type) {
          screen.current.value = `${value}`;
        } else if (type) {
          screen.current.value += value;
        }
      }
    },

    clickingNums: (btnValue: number | string) => {
      if (screen.current) {
        const { updateDisplay } = calculator;

        const inputTxt: string = screen.current.value,
          lastChar: string = inputTxt[inputTxt.length - 1]; // Last Char In The Input

        const { isResultDisplayed } = calculator;

        if (isResultDisplayed === false) {
          updateDisplay(1, `${btnValue}`);
        } else if (
          (isResultDisplayed === true && lastChar === "+") ||
          lastChar === "-" ||
          lastChar === "×" ||
          lastChar === "÷"
        ) {
          calculator.isResultDisplayed = false;
          updateDisplay(1, `${btnValue}`);
        } else {
          calculator.isResultDisplayed = false;
          screen.current.value = "";

          updateDisplay(0, "");
          updateDisplay(1, `${btnValue}`);
        }
      }
    },

    clickingOperators: (btnValue: string) => {
      if (screen.current) {
        const { updateDisplay } = calculator;

        const inputTxt: string = screen.current.value,
          lastChar = inputTxt[inputTxt.length - 1]; // Last Char In The Input

        // Make It More Flexable If The User Enters These Chars In The Keyboard
        if (btnValue === "*" || btnValue === "x") {
          btnValue = "×";
        } else if (btnValue === "/") {
          btnValue = "÷";
        }

        if (
          lastChar === "+" ||
          lastChar === "-" ||
          lastChar === "×" ||
          lastChar === "÷"
        ) {
          const newString =
            inputTxt.substring(0, inputTxt.length - 1) + btnValue;
          updateDisplay(0, newString);
        } else if (inputTxt.length === 0) {
          return;
        } else {
          updateDisplay(1, btnValue);
        }
      }
    },

    showResult: () => {
      if (screen.current) {
        const { updateDisplay } = calculator;

        const finalTxt: string = screen.current.value;

        const numsOnly: number[] = finalTxt
          .split(/\+|-|×|÷/g)
          .map((num) => parseFloat(num));

        const operatorsOnly: string[] = finalTxt
          .replace(/[0-9]|\./g, "")
          .split("");

        let divide: number = operatorsOnly.indexOf("÷");
        while (divide !== -1) {
          numsOnly.splice(divide, 2, numsOnly[divide] / numsOnly[divide + 1]);
          operatorsOnly.splice(divide, 1);
          divide = operatorsOnly.indexOf("÷");
        }

        let multiply: number = operatorsOnly.indexOf("×");
        while (multiply !== -1) {
          numsOnly.splice(
            multiply,
            2,
            numsOnly[multiply] * numsOnly[multiply + 1]
          );
          operatorsOnly.splice(multiply, 1);
          multiply = operatorsOnly.indexOf("×");
        }

        let subtract: number = operatorsOnly.indexOf("-");
        while (subtract !== -1) {
          numsOnly.splice(
            subtract,
            2,
            numsOnly[subtract] - numsOnly[subtract + 1]
          );
          operatorsOnly.splice(subtract, 1);
          subtract = operatorsOnly.indexOf("-");
        }

        let add: number = operatorsOnly.indexOf("+");
        while (add !== -1) {
          numsOnly.splice(
            add,
            2,
            parseFloat(`${numsOnly[add]}`) + parseFloat(`${numsOnly[add + 1]}`)
          );
          operatorsOnly.splice(add, 1);
          add = operatorsOnly.indexOf("+");
        }

        const result: number = numsOnly[0];

        updateDisplay(0, `${result}`);
        calculator.isResultDisplayed = true;
        screen.current.focus();
      }
    },

    reset: () => {
      const { updateDisplay } = calculator;
      updateDisplay(0, "");
    },

    del: () => {
      if (screen.current) {
        const { updateDisplay } = calculator;

        const inputTxt: string[] = screen.current.value.split("");
        inputTxt.splice(-1, 1);

        const filteredTxt: string = inputTxt.join("");
        updateDisplay(0, filteredTxt);
      }
    },
  };

  const renderBtns = (arr: (string | number)[]): JSX.Element[] => {
    const btnClicking = (btnValue: string | number) => {
      if (screen.current) {
        const { clickingNums, clickingOperators, showResult, del, reset } =
          calculator;

        switch (typeof btnValue) {
          case "number":
            clickingNums(btnValue);
            break;
        }

        switch (btnValue) {
          case "+":
          case "-":
          case "×":
          case "÷":
            clickingOperators(btnValue);
            break;
          case "=":
            showResult();
            break;
          case "reset":
            reset();
            break;
          case "del":
            del();
            break;
        }
      }
    };

    return arr.map((btnValue) => {
      let className: string = "";

      if (btnValue === "del") className = "del-btn uppercase";
      if (
        btnValue === "+" ||
        btnValue === "÷" ||
        btnValue === "×" ||
        btnValue === "-"
      )
        className = "calc-btn operator";
      if (btnValue === ".") className = "calc-btn decimal";
      if (btnValue === "reset") className = "reset-btn";
      if (btnValue === "=") className = "result-btn uppercase";
      if (typeof btnValue === "number") className = "calc-btn operator";

      return (
        <button
          key={btnValue}
          className={`${className} ${isMain && "max-h-[100px]"}`}
          onClick={() => btnClicking(btnValue)}
        >
          {btnValue}
        </button>
      );
    });
  };

  // Handling KeyBoard Clicking
  const handleKeyboard = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { clickingNums, clickingOperators, reset, del, showResult } =
      calculator;
    const { key } = e;

    // Checking If The Screen Is Focused On
    if (document.activeElement === screen.current) {
      switch (isNaN(parseInt(key))) {
        case false:
          clickingNums(key);
          break;
      }

      switch (key) {
        case "+":
        case "-":
        case "*":
        case "x":
        case "/":
          clickingOperators(key);
          break;
        case "=":
        case "Enter":
          showResult();
          break;
        case "Escape":
          reset();
          break;
        case "Backspace":
          del();
          break;
      }
    }
  };

  useEffect(() => {
    editClassOnMount(
      ".main-nav__functions .calculator",
      setSelectedLink,
      "calculator"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`calculator bg-light-black h-full rounded-[6px] p-2 flex-col gap-3 max-w-[390px] ${
        isMain ? "mx-auto flex h-[500px]" : "hidden sm:flex"
      }`}
    >
      <input
        className="calculator__screen bg-dark-black text-white w-full py-2 px-3 rounded-[6px] text-right text-[30px] font-medium"
        ref={screen}
        readOnly
        onKeyUp={handleKeyboard}
      />
      <div className="calculator__buttons bg-dark-black w-full flex-1 rounded-[6px] px-3 py-3 text-white text-[22px] font-medium">
        {renderBtns(btnsArr)}
      </div>
    </div>
  );
};

export default Calculator;
