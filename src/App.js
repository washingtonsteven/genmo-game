import { Genmo } from "@esaevian/genmo-v2";
import { useEffect, useState, useRef, cloneElement } from "react";
import Engine from "./story/Engine.json";

const emptyPassage = {
  passageText: "No Passage Loaded",
};

const GenmoProvider = (props) => {
  const [currentPassage, setCurrentPassage] = useState(emptyPassage);
  const genmoRef = useRef();
  const followLink = (link) => {
    if (!genmoRef.current) {
      console.error("No genmoref!");
      return;
    }
    console.log("following Link");
    genmoRef.current.followLink(link, () => {
      genmoRef.current.outputCurrentPassage();
    });
  };
  useEffect(() => {
    genmoRef.current = new Genmo(Engine, {
      outputFunction: setCurrentPassage,
    });
    setCurrentPassage(genmoRef.current.getCurrentPassage());
  }, []);
  const allProps = {
    ...props,
    currentPassage,
    followLink,
    genmo: genmoRef.current,
  };
  return <div>{cloneElement(props.children, { ...allProps })}</div>;
};

const GenmoGame = ({ currentPassage, followLink, genmo }) => {
  const linkClick = (link) => {
    return () => {
      followLink(link);
    };
  };

  return (
    <div>
      <div className="text">{currentPassage.passageText}</div>
      {currentPassage.links && (
        <div className="links">
          {currentPassage.links.map((link) => (
            <button key={link.pid} onClick={linkClick(link)}>
              {link.name}
            </button>
          ))}
        </div>
      )}
      {genmo && (
        <div className="state">
          <pre>
            <code>{JSON.stringify(genmo.state.data, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <GenmoProvider>
      <GenmoGame />
    </GenmoProvider>
  );
};

export default App;
