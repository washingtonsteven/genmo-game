import { Genmo } from "@esaevian/genmo-v2";
import { makeStyles } from "@material-ui/core";
import { useEffect, useState, useRef, cloneElement } from "react";
import { getHelpers, helperStyles } from "./utils/helpers";

const emptyPassage = {
  passageText: "No Passage Loaded",
};

const useHelperStyles = makeStyles(helperStyles);

export const GenmoProvider = (props) => {
  const [currentPassage, setCurrentPassage] = useState(emptyPassage);
  const genmoRef = useRef();
  const helperClasses = useHelperStyles();
  const followLink = (link) => {
    if (!genmoRef.current) {
      console.error("No genmoref!");
      return;
    }
    genmoRef.current.followLink(link, () => {
      genmoRef.current.outputCurrentPassage();
    });
  };
  const respondToPrompt = (response) => {
    Object.entries(response).forEach(([key, value]) => {
      genmoRef.current.respondToPrompt({ [key]: value });
    });
    genmoRef.current.outputCurrentPassage();
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
    // debug
    (window || {}).genmo = genmoRef.current;
    setCurrentPassage(genmoRef.current.getCurrentPassage());
  }, [props.storyData]);
  useEffect(() => {
    if (!genmoRef.current) return;
    const helpers = getHelpers(helperClasses);
    Object.entries(helpers).forEach(([helperName, helperFn]) => {
      genmoRef.current.addHelper(helperName, helperFn);
    });
  }, [helperClasses]);
  const allProps = {
    ...props,
    currentPassage,
    followLink,
    respondToPrompt,
    genmo: genmoRef.current,
  };
  if (!genmoRef.current) {
    return <div>Loading your story...</div>;
  }
  return <div>{cloneElement(props.children, { ...allProps })}</div>;
};
