import { Genmo } from "@esaevian/genmo-v2";
import { useEffect, useState, useRef } from "react";
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
  return (
    <div>
      {props.children({
        currentPassage,
        followLink,
        genmo: genmoRef.current,
      })}
    </div>
  );
};

const App = () => {
  return (
    <GenmoProvider>
      {({ currentPassage, followLink, genmo }) => {
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
      }}
    </GenmoProvider>
  );
};

export default App;
