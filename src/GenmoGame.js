import {
  Container,
  createMuiTheme,
  CssBaseline,
  Grid,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core";
import React from "react";
import { PassageText } from "./elements/PassageText";
import { Links } from "./elements/Links";
import { Stats } from "./elements/Stats";
import { Inventory } from "./elements/Inventory";
import { allPromptsResponded } from "./utils/promptFunctions";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  sidebar: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export const GenmoGame = ({
  currentPassage,
  followLink,
  respondToPrompt,
  genmo,
}) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="lg" className={classes.root}>
        <CssBaseline />
        <Grid container spacing={2}>
          {/* Left Side */}
          <Grid item xs={12} sm={7} lg={9}>
            <Grid container spacing={2}>
              <PassageText
                passage={currentPassage}
                onPromptResponded={respondToPrompt}
              />
              <Links
                links={currentPassage.links}
                onLinkClicked={followLink}
                disabled={!allPromptsResponded(currentPassage)}
              />
            </Grid>
          </Grid>
          {/* Right Side */}
          <Grid item xs={12} sm={5} lg={3}>
            <Grid container spacing={2} className={classes.sidebar}>
              <Stats data={genmo.getData()} />
              <Inventory inventory={genmo.getInventory()} />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};
