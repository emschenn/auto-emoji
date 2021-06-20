import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";

import "../style/global.scss";

// components
import EmojiCard from "../components/EmojiCard";
import Sparkle from "../components/Sparkle";
import Modal from "../components/Modal";

const IndexPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {}, []);

  return (
    <AnimatePresence>
      <motion.main>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Auto Emoji</title>
        </Helmet>
        <motion.section
          className="show"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="card-panel">
            <Sparkle color="#e7ba66" />
            <EmojiCard shape="circle" color="#27502D" />
            <Sparkle color="#CC5D33" />
            <EmojiCard shape="rectangle" color="#7B95AE" />
            <Sparkle color="#E9B4A5" />
            <EmojiCard shape="rectangle" color="#e7ba66" />
            <Sparkle color="#D6CCBD" />
            <EmojiCard shape="rectangle" color="#CC5D33" />
            <Sparkle color="#27502D" />
            <EmojiCard shape="circle" color="#e7ba66" />
            <Sparkle color="#7B95AE" />
            <EmojiCard shape="circle" color="#E9B4A5" />
          </div>
        </motion.section>
        <motion.section
          className="intro"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h1>Auto Emoji</h1>
          <h2>
            Auto Emoji is an emoji assisting tool. <br />
            Type a sentence, and the system will recommend a list of emoji based
            on your phrase 😉
          </h2>

          <Link className="link" to="/play">
            <span> click here to try!</span>
          </Link>
        </motion.section>
      </motion.main>
      {modalOpen && <Modal setModalOpen={setModalOpen} />}
    </AnimatePresence>
  );
};

export default IndexPage;
