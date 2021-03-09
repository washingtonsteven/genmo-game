import { Container, CssBaseline, Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { PassageText } from "./elements/PassageText";
import { Links } from "./elements/Links";
import { Stats } from "./elements/Stats";
import { Inventory } from "./elements/Inventory";
import { Map } from "./elements/Map";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
  },
}));

export const GenmoGame = ({ currentPassage, followLink, genmo }) => {
  const [lastRegionBoundary, setLastRegionBoundary] = useState(null);
  useEffect(() => {
    const passageData = genmo.getPassageData(currentPassage);
    if (passageData.region_boundary) {
      if (passageData.region_nomap) setLastRegionBoundary(null);
      else setLastRegionBoundary(currentPassage);
    }
  }, [currentPassage, genmo]);
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
            <Grid item xs={12}>
              <Map
                genmo={genmo}
                startingPassage={lastRegionBoundary}
                focusedNode={currentPassage}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
