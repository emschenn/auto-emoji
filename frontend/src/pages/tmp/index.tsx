import React, { useState, useEffect } from "react";
import getCaretCoordinates from "textarea-caret";

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

const IndexPage = () => {
  const [input, setInput] = useState("");
  const [newLine, setNewLine] = useState([{ top: 20 }]);
  const [insertEmoji, setInsertEmoji] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState<ISelectEmoji>({
    on: false,
    select: -1,
  });
  const [caret, setCaret] = useState<ICaret>();

  const onInputChange = (e) => {
    console.log(input);

    if (newLine[newLine.length - 1].top > 430) {
      return;
    }
    setInput(e.target.value);

    if (e.target.value[e.target.value.length - 1] === "\n") {
      addNewLine(e.target);
    }
    if (e.target.value[e.target.value.length - 1] === "#") {
      updateTooltip(e.target);
      setSelectEmoji({
        on: true,
        select: -1,
      });
    } else {
      if (!insertEmoji)
        setSelectEmoji({
          on: false,
          select: -1,
        });
    }
  };

  const onInputKeyDown = (e) => {
    if (!selectEmoji.on) {
      return;
    }
    if (e.key === "ArrowDown") {
      if (selectEmoji.select !== -1) {
        const i = selectEmoji.select;
        setSelectEmoji({
          on: true,
          select: i === emotionOption.length - 1 ? 0 : i + 1,
        });
      } else {
        setSelectEmoji({ on: true, select: 0 });
      }
    } else if (selectEmoji.select !== -1 && e.key === "Enter") {
      setInsertEmoji(true);
    } else {
      setSelectEmoji({
        on: false,
        select: -1,
      });
    }
  };

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

  const addNewLine = (target) => {
    const start = target.selectionStart;
    const { top: startTop, left: startLeft } = getCaretCoordinates(
      target,
      start
    );
    const anchorTop = target.offsetTop - target.scrollTop + startTop;
    const anchorLeft = target.offsetLeft - target.scrollLeft + startLeft;
    setNewLine([...newLine, { top: anchorTop - 5 }]);
  };

  const emotionOption = ["🤣", "🎉"];
  const contentOption = ["👩🏻‍💻", "💩", "👀"];

  const onOptionClick = (value) => {
    const newInput = input.substring(0, input.length - 1) + value;
    setInput(newInput);
    setSelectEmoji({
      on: false,
      select: -1,
    });
  };

  const emojiTooltip = () => (
    <div
      className="tooltip-container"
      style={{
        position: "absolute",
        top: `${caret.anchorTop + 34}px`,
        left: `${caret.anchorLeft - 30}px`,
      }}
    >
      <div className="tooltip">
        <ul>
          <p>emotion:</p>
          {emotionOption.map((o, i) => (
            <li
              className={`emo-option-${i}`}
              key={`emo-option-${i}`}
              onClick={() => onOptionClick(o)}
            >
              {o}
            </li>
          ))}
        </ul>
        <ul>
          <p>content:</p>
          {contentOption.map((o, i) => (
            <li
              className={`con-option-${i}`}
              key={`con-option-${i}`}
              onClick={() => onOptionClick(o)}
            >
              {o}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const selectOption = (i) => {
    let elements = [];
    emotionOption.forEach((_, i) => {
      const element = document.getElementsByClassName("emo-option-" + i)[0];
      elements.push(element);
      element.classList.remove("focus");
    });
    elements[i].classList.add("focus");
  };

  useEffect(() => {
    console.log(selectEmoji.select);

    if (selectEmoji.select !== undefined) {
      console.log("??");
      selectOption(selectEmoji.select);
    }
    if (insertEmoji && selectEmoji.select !== undefined) {
      const element: HTMLElement = document.getElementsByClassName(
        "option-" + selectEmoji.select
      )[0] as HTMLElement;
      element.click();
      setInsertEmoji(false);
    }
  }, [selectEmoji]);

  return (
    <main>
      <section className="intro">
        <h1>Why Emojis 😉?</h1>
      </section>
      <section className="demo">
        <div className="input">
          <div className="deco-box">
            {newLine?.map(({ top }, i) => (
              <p key={i} style={{ top: top }}></p>
            ))}
          </div>
          <textarea
            name="input"
            className="textarea"
            value={input}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
          ></textarea>
          {selectEmoji.on && emojiTooltip()}
        </div>
      </section>
    </main>
  );
};

export default IndexPage;
