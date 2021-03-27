import Engine from "./stories/Engine.json";
import Bunker from "./stories/Bunker.json";
import { GenmoProvider } from "./GenmoProvider";
import { GenmoGame } from "./GenmoGame";
import {
  AppBar,
  Button,
  Container,
  createMuiTheme,
  IconButton,
  makeStyles,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Fragment, useState } from "react";
import { ArrowBack } from "@material-ui/icons";

const stories = [Engine, Bunker];

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  storyButton: {
    display: "block",
    width: "100%",
    marginBottom: theme.spacing(2),
  },
}));

const StorySelector = ({ stories, onStorySelected, classes }) => {
  return (
    <Container maxWidth="sm" className={classes.root}>
      <h1>Select A Story</h1>
      {stories.map((storyData) => (
        <Button
          key={storyData.name}
          onClick={() => onStorySelected(storyData)}
          variant="contained"
          color="primary"
          className={classes.storyButton}
        >
          {storyData.name}
        </Button>
      ))}
    </Container>
  );
};

const GenmoToolbar = ({ storyName, onBackClicked }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" onClick={onBackClicked}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">{storyName}</Typography>
      </Toolbar>
    </AppBar>
  );
};

const App = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      {selectedStory ? (
        <Fragment>
          <GenmoToolbar
            storyName={selectedStory.name}
            onBackClicked={() => setSelectedStory(null)}
          />
          <GenmoProvider storyData={selectedStory}>
            <GenmoGame classes={classes} />
          </GenmoProvider>
        </Fragment>
      ) : (
        <StorySelector
          classes={classes}
          stories={stories}
          onStorySelected={(story) =>
            setSelectedStory(stories.find((s) => s.name === story.name))
          }
        />
      )}
    </ThemeProvider>
  );
};

export default App;
