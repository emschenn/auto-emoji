import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ArticleContext } from "../pages/play";

interface IProps {
  text: string;
}

const AllTextModal = ({ text }: IProps) => {
  const { article, setArticle } = useContext(ArticleContext);

  return (
    <motion.div
      className="all-text-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {Object.values(article).join(" ")}
    </motion.div>
  );
};

export default AllTextModal;
