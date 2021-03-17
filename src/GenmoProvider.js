import { Genmo } from "@esaevian/genmo-v2";
import { useEffect, useState, useRef, cloneElement } from "react";

const emptyPassage = {
  passageText: "No Passage Loaded",
};

export const GenmoProvider = (props) => {
  const [currentPassage, setCurrentPassage] = useState(emptyPassage);
  const genmoRef = useRef();
  const followLink = (link) => {
    if (!genmoRef.current) {
      console.error("No genmoref!");
      return;
    }
    genmoRef.current.followLink(link, () => {
      genmoRef.current.outputCurrentPassage();
    });
  };
  useEffect(() => {
    if (genmoRef.current) {
      if (
        !process ||
        !process.env.NODE_ENV ||
        !process.env.NODE_ENV === "development"
      )
        throw new Error("Attempted to overwrite Genmo!");
    }
    genmoRef.current = new Genmo(props.storyData, {
      outputFunction: setCurrentPassage,
    });
    setCurrentPassage(genmoRef.current.getCurrentPassage());
  }, [props.storyData]);
  const allProps = {
    ...props,
    currentPassage,
    followLink,
    genmo: genmoRef.current,
  };
  if (!genmoRef.current) {
    return <div>Loading your story...</div>;
  }
  return <div>{cloneElement(props.children, { ...allProps })}</div>;
};
