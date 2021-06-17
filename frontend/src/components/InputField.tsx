import React, { useState, useContext, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import getCaretCoordinates from "textarea-caret";
import Cookies from "js-cookie";

// components
import Tooltip from "./Tooltip";

import { ArticleContext } from "../pages/play";

interface ISelectEmoji {
  on: boolean;
  select: number;
}

interface ICaret {
  start: number;
  end: number;
  anchorTop: number;
  anchorLeft: number;
}

interface IProps {
  init: boolean;
  id: number;
  addNewLine: (number) => void;
  removeLine: (number) => void;
}

const setPersonalEmoji = (value) => {
  const personalEmoji = JSON.parse(Cookies.get("personal-emojis"));
  if (personalEmoji[value]) {
    personalEmoji[value] = personalEmoji[value] + 1;
  } else {
    personalEmoji[value] = 1;
  }
  Cookies.set("personal-emojis", JSON.stringify(personalEmoji), {
    expires: 30,
  });
};

const InputField = ({ init, id, addNewLine, removeLine }: IProps) => {
  const [input, setInput] = useState("");
  const [caret, setCaret] = useState<ICaret>();
  const [selectEmoji, setSelectEmoji] = useState<ISelectEmoji>({
    on: false,
    select: -1,
  });
  const { article, setArticle } = useContext(ArticleContext);

  const updateTooltip = (target) => {
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const {
      top: startTop,
      left: startLeft,
      height: anchorHeight,
    } = getCaretCoordinates(target, start);
    const { top: endTop, left: endLeft } = getCaretCoordinates(target, end);
    const anchorWidth = startTop === endTop ? endLeft - startLeft : 0; // TODO
    const anchorTop = target.offsetTop - target.scrollTop + startTop;
    const anchorLeft = target.offsetLeft - target.scrollLeft + startLeft;
    setCaret({ start, end, anchorTop, anchorLeft });
  };

  const onInputChange = (e) => {
    if (e.target.value[e.target.value.length - 1] === "\n") return;
    setInput(e.target.value);
    if (e.target.value[e.target.value.length - 1] === "#") {
      updateTooltip(e.target);
      // send an api with input
      setSelectEmoji({
        on: true,
        select: -1,
      });
    } else if (selectEmoji.on) {
      setSelectEmoji({
        on: false,
        select: -1,
      });
    }
  };

  const onInputKeyDown = (e) => {
    if (!init && e.key === "Backspace" && e.shiftKey) {
      console.log(id);
      removeLine(id);
    }
    if (e.key === "Enter" && e.shiftKey) {
      addNewLine(id);
    }
  };

  const onOptionClick = (value) => {
    const newInput = input.substring(0, input.length - 1) + value;
    setPersonalEmoji(value);
    setInput(newInput);
    setSelectEmoji({
      on: false,
      select: -1,
    });
  };

  const emotionOption = ["🤣", "🎉"];
  const contentOption = ["👩🏻‍💻", "💩", "👀"];

  useEffect(() => {
    let add = {};
    add[id] = input;
    setArticle({ ...article, ...add });
  }, [input]);

  return (
    <div className="input">
      <div className="prefix">👉🏼</div>
      <TextareaAutosize
        maxRows={5}
        className="textarea"
        value={input}
        onChange={onInputChange}
        onKeyDown={onInputKeyDown}
        placeholder={init ? "Try Here!" : ""}
        autoFocus
      />
      {selectEmoji.on && (
        <Tooltip input={input} caret={caret} onOptionClick={onOptionClick} />
      )}
      {/* <div className="copy">
        <svg
          width="20"
          height="23"
          viewBox="0 0 23 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.2533 22.3643V24.3174C16.2533 24.9646 15.7287 25.4893 15.0815 25.4893H1.8002C1.15298 25.4893 0.628326 24.9646 0.628326 24.3174V6.34866C0.628326 5.70145 1.15298 5.17679 1.8002 5.17679H5.31583V19.6299C5.31583 21.1377 6.54244 22.3643 8.0502 22.3643H16.2533ZM16.2533 5.56741V0.489288H8.0502C7.40298 0.489288 6.87833 1.01395 6.87833 1.66116V19.6299C6.87833 20.2771 7.40298 20.8018 8.0502 20.8018H21.3315C21.9787 20.8018 22.5033 20.2771 22.5033 19.6299V6.73929H17.4252C16.7807 6.73929 16.2533 6.21194 16.2533 5.56741ZM22.1601 4.05233L18.9403 0.832501C18.7205 0.612747 18.4225 0.48929 18.1117 0.489288L17.8158 0.489288V5.17679H22.5033V4.88094C22.5033 4.57015 22.3799 4.27209 22.1601 4.05233V4.05233Z"
            fill="black"
            fill-opacity="0.1"
          />
        </svg>
      </div> */}
      {/* <div className="close" onClick={() => removeLine(id)}>
        <svg
          width="26"
          height="23"
          viewBox="0 0 26 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.706 0.277649H2.39349C1.09955 0.277649 0.0497437 1.32745 0.0497437 2.6214V19.8089C0.0497437 21.1028 1.09955 22.1526 2.39349 22.1526H22.706C23.9999 22.1526 25.0497 21.1028 25.0497 19.8089V2.6214C25.0497 1.32745 23.9999 0.277649 22.706 0.277649ZM18.624 14.4622C18.8583 14.6966 18.8583 15.0775 18.624 15.3118L16.6464 17.2894C16.412 17.5237 16.0312 17.5237 15.7968 17.2894L12.5497 14.013L9.30267 17.2894C9.0683 17.5237 8.68744 17.5237 8.45306 17.2894L6.47553 15.3118C6.24115 15.0775 6.24115 14.6966 6.47553 14.4622L9.75189 11.2151L6.47553 7.96808C6.24115 7.7337 6.24115 7.35284 6.47553 7.11847L8.45306 5.14093C8.68744 4.90656 9.0683 4.90656 9.30267 5.14093L12.5497 8.4173L15.7968 5.14093C16.0312 4.90656 16.412 4.90656 16.6464 5.14093L18.624 7.11847C18.8583 7.35284 18.8583 7.7337 18.624 7.96808L15.3476 11.2151L18.624 14.4622Z"
            fill="black"
            fill-opacity="0.05"
          />
        </svg>
      </div> */}
    </div>
  );
};

export default InputField;
