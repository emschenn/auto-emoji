import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { postData } from "../utils/api";

interface ICaretPos {
  start: number;
  end: number;
  anchorTop: number;
  anchorLeft: number;
}

interface IProps {
  input: string;
  caret: ICaretPos;
  onOptionClick: (string) => void;
}

const getPersonalEmoji = () => {
  const personalEmoji = JSON.parse(Cookies.get("personal-emojis"));
  const sortable = Object.fromEntries(
    Object.entries(personalEmoji).sort(([, a]: any, [, b]: any) => b - a)
  );
  return Object.keys(sortable).slice(0, 5);
};

const Tooltip = ({ input, caret, onOptionClick }: IProps) => {
  const [items, setItems] = useState<HTMLElement[]>();
  const [focusItem, setFocusItem] = useState(0);
  const [checkFocus, setCheckFocus] = useState(false);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    postData(`${process.env.GATSBY_API_URL}/predict`, { input: input })
      .then((data) => {
        console.log(data);
        setOptions({
          ...data,
          personalOption: getPersonalEmoji(),
        });
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!options) return;
    const list: HTMLElement = document.getElementById("list") as HTMLElement;
    const items = [
      ...list.children[0].getElementsByTagName("li"),
      ...list.children[1].getElementsByTagName("li"),
      ...list.children[2].getElementsByTagName("li"),
    ];
    setItems(items);
    items[focusItem].focus();
  }, [options]);

  useEffect(() => {
    if (checkFocus) {
      const list: HTMLElement = document.getElementById("list") as HTMLElement;
      const items = [
        ...list.children[0].getElementsByTagName("li"),
        ...list.children[1].getElementsByTagName("li"),
        ...list.children[2].getElementsByTagName("li"),
      ];
      items.forEach((i) => {
        if (i === document.activeElement) {
          i.click();
        }
      });
      setCheckFocus(false);
    }
  }, [checkFocus]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      setCheckFocus(true);
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      const nextItem = focusItem + 1;
      if (nextItem > items.length - 1) {
        setFocusItem(0);
      } else {
        setFocusItem(nextItem);
      }
      items[focusItem].focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      const nextItem = focusItem - 1;
      if (nextItem < 0) {
        setFocusItem(items.length - 1);
      } else {
        setFocusItem(nextItem);
      }
      items[focusItem].focus();
    }
  };

  return (
    <div
      className="tooltip-container"
      style={{
        position: "absolute",
        top: `${caret.anchorTop + 34}px`,
        left: `${caret.anchorLeft - 30}px`,
      }}
    >
      <div className="tooltip">
        <ul id="list" onKeyDown={onKeyDown}>
          <ul className="inner-list">
            <label>sentiment:</label>
            {options?.emotionOption?.map((o, i) => (
              <li
                tabIndex={i}
                className={`emo-option-${i}`}
                key={`emo-option-${i}`}
                onClick={() => onOptionClick(o)}
              >
                {o}
              </li>
            ))}
          </ul>
          <ul className="inner-list">
            <label>content:</label>
            {options?.contentOption?.map((o, i) => (
              <li
                tabIndex={options?.contentOption?.length + i}
                className={`con-option-${i}`}
                key={`con-option-${i}`}
                onClick={() => onOptionClick(o)}
              >
                {o}
              </li>
            ))}
          </ul>
          <ul className="inner-list">
            <label>personal:</label>
            {options?.personalOption?.map((o, i) => (
              <li
                tabIndex={options?.personalOption?.length + i}
                className={`per-option-${i}`}
                key={`per-option-${i}`}
                onClick={() => onOptionClick(o)}
              >
                {o}
              </li>
            ))}
          </ul>
        </ul>
      </div>
    </div>
  );
};

export default Tooltip;
