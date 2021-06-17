import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

// components
import InputField from "../../components/InputField";
import AllTextModal from "../../components/AllTextModal";

interface IProps {}

const insertOne = (arr, index, newItem) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index),
];

const deleteOne = (arr, index) => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1),
];

const Backspace = () => (
  <svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect
        fill="none"
        x="18.64464"
        y="8.88531"
        width="60"
        height="33.17527"
        id="svg_18"
        rx="10"
        strokeWidth="1.4"
        stroke="#000"
      />
      <g stroke="null" id="svg_6">
        <path
          stroke="null"
          id="svg_5"
          d="m60.99868,16.0293l-18.54821,0a3.20043,3.20043 0 0 0 -2.26437,0.93807l-7.53605,7.53555c-0.62538,0.62538 -0.62538,1.63899 0,2.26387l7.53605,7.53605c0.60036,0.60036 1.41485,0.93807 2.26387,0.93807l18.54871,0c1.76857,0 3.20193,-1.43337 3.20193,-3.20193l0,-12.80774c0,-1.76857 -1.43337,-3.20193 -3.20193,-3.20193zm-4.23706,12.71068c0.31269,0.31269 0.31269,0.8195 0,1.13218l-1.13168,1.13168c-0.31269,0.31269 -0.8195,0.31269 -1.13218,0l-3.10488,-3.10488l-3.10488,3.10488c-0.31269,0.31269 -0.8195,0.31269 -1.13218,0l-1.13168,-1.13168c-0.31269,-0.31269 -0.31269,-0.8195 0,-1.13218l3.10488,-3.10488l-3.10488,-3.10488c-0.31269,-0.31269 -0.31269,-0.8195 0,-1.13218l1.13168,-1.13168c0.31269,-0.31269 0.8195,-0.31269 1.13218,0l3.10488,3.10488l3.10488,-3.10488c0.31269,-0.31269 0.8195,-0.31269 1.13218,0l1.13168,1.13168c0.31269,0.31269 0.31269,0.8195 0,1.13218l-3.10488,3.10488l3.10488,3.10488z"
          fill="currentColor"
        />
      </g>
    </g>
  </svg>
);

const Key = ({ text }) => (
  <svg
    width="100"
    height="50"
    xmlns="http://www.w3.org/2000/svg"
    style={{ margin: "-1.5rem -1rem" }}
  >
    <g>
      <rect
        stroke="#000"
        strokeWidth="1.4"
        rx="10"
        id="svg_18"
        height="33.17527"
        width="85"
        y="8.88531"
        x="7.53357"
        fill="none"
      />
      <text
        fontStyle="normal"
        fontWeight="normal"
        textAnchor="start"
        fontFamily="monospace"
        fontSize="24"
        id="svg_3"
        y="32.28814"
        x="14.22141"
        strokeWidth="0"
        stroke="#000"
        fill="#000000"
      >
        {text}
      </text>
    </g>
  </svg>
);

const useArticle = () => {
  const [article, setArticle] = useState<object>([]);

  return {
    article,
    setArticle,
  };
};

export const ArticleContext = React.createContext(
  {} as ReturnType<typeof useArticle>
);

const PlayIndex = ({}: IProps) => {
  const [lineCount, setLineCount] = useState([]);
  const [showAllTextModal, setShowAllTextModal] = useState(false);
  const { article, setArticle } = useArticle();

  const addNewLine = (id) => {
    const newLineId = new Date().getTime();
    if (id === -1) {
      setLineCount([newLineId, ...lineCount]);
      return;
    }
    const index = lineCount.findIndex((element) => element === id);
    const newLines = insertOne(lineCount, index + 1, newLineId);
    setLineCount(newLines);
  };

  const removeLine = (id) => {
    const index = lineCount.findIndex((element) => element === id);
    const newLines = deleteOne(lineCount, index);
    setLineCount(newLines);
    const newArticle = article;
    delete newArticle[id];
    setArticle(newArticle);
  };

  const onCopyHover = () => {
    setShowAllTextModal(!showAllTextModal);
  };

  const onCopy = () => {
    const elem = document.createElement("textarea");
    elem.value = Object.values(article).join(" ");
    document.body.appendChild(elem);
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
  };

  return (
    <ArticleContext.Provider value={{ article, setArticle }}>
      <AnimatePresence>
        <main>
          <motion.section
            className="tutorial"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h1>How to use 👀 </h1>
            <h2>
              1. Enter your sentence
              <br />
              2. Press # to trigger emoji
              <br />
              3. Select the emoji 🎉
              <br />
              4. <Key text="shift" /> + <Key text="enter" /> to add newline
              <br />
              5. <Key text="shift" /> + <Backspace /> to remove line
            </h2>
          </motion.section>
          <section className="demo">
            <div className="helper">
              <div
                className="copy"
                onMouseEnter={onCopyHover}
                onMouseLeave={onCopyHover}
                onClick={onCopy}
              >
                copy all
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
                    fillOpacity="0.1"
                  />
                </svg>
              </div>
              {showAllTextModal && (
                <AllTextModal text="Lorem ipsum dolor sit amet consectetur adipisicing 👻 Qui sit ipsam consequuntur laborum quisquam consectetur reiciendis sequi repellendus dolorem aliquid 🎃" />
              )}
            </div>
            <motion.div
              className="input-area"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { delay: 0.2 } }}
            >
              <InputField
                init={true}
                id={-1}
                addNewLine={addNewLine}
                removeLine={removeLine}
              />
              {lineCount.map((id) => (
                <InputField
                  init={false}
                  key={id}
                  id={id}
                  addNewLine={addNewLine}
                  removeLine={removeLine}
                />
              ))}
            </motion.div>
          </section>
        </main>
      </AnimatePresence>
    </ArticleContext.Provider>
  );
};

export default PlayIndex;
