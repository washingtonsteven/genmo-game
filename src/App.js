import Engine from "./story/Engine.json";
import { GenmoProvider } from "./GenmoProvider";
import { GenmoGame } from "./GenmoGame";

const App = () => {
  return (
    <GenmoProvider storyData={Engine}>
      <GenmoGame />
    </GenmoProvider>
  );
};

export default App;
