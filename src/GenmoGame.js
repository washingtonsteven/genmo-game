import { Container, CssBaseline, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { PassageText } from "./elements/PassageText";
import { Links } from "./elements/Links";
import { Stats } from "./elements/Stats";
import { Inventory } from "./elements/Inventory";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
  },
}));

export const GenmoGame = ({ currentPassage, followLink, genmo }) => {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.root}>
      <CssBaseline />
      <Grid container spacing={2}>
        {/* Left Side */}
        <Grid item xs={9}>
          <Grid container spacing={2}>
            <PassageText passageText={currentPassage.passageText} />
            <Links links={currentPassage.links} onLinkClicked={followLink} />
          </Grid>
        </Grid>
        {/* Right Side */}
        <Grid item xs={3}>
          <Grid container spacing={2}>
            <Stats data={genmo.getData()} />
            <Inventory inventory={genmo.getInventory()} />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
