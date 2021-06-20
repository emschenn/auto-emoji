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
  const cookieData = Cookies.get("personal-emojis");
  if (!cookieData) {
    let personalEmoji = {};
    personalEmoji[value] = 1;
    Cookies.set("personal-emojis", JSON.stringify(personalEmoji), {
      expires: 30,
    });
    return;
  }
  const personalEmoji = JSON.parse(cookieData);
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
    </div>
  );
};

export default InputField;
