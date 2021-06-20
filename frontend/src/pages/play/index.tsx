import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isMobile } from "react-device-detect";
import { Helmet } from "react-helmet";

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

  useEffect(() => {
    if (isMobile) {
      alert(
        "The project is design for the desktop 💻\nPlease open it on desktop / laptop for better experience 💫"
      );
    }
  }, []);

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
    elem.value = Object.values(article).join("\n");
    document.body.appendChild(elem);
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
  };

  return (
    <ArticleContext.Provider value={{ article, setArticle }}>
      <AnimatePresence>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Auto Emoji</title>
        </Helmet>
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
              4. <span>shift</span> + <span>enter</span> to add newline
              <br />
              5. <span>shift</span> + <span>backspace</span> to remove line
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
