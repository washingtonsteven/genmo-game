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

  // return (
  //   <div>
  //     <div className="text">{currentPassage.passageText}</div>
  //     {currentPassage.links && (
  //       <div className="links">
  //         {currentPassage.links.map((link) => (
  //           <button key={link.pid} onClick={linkClick(link)}>
  //             {link.name}
  //           </button>
  //         ))}
  //       </div>
  //     )}
  //     {genmo && (
  //       <div className="state">
  //         <pre>
  //           <code>{JSON.stringify(genmo.state.data, null, 2)}</code>
  //         </pre>
  //       </div>
  //     )}
  //   </div>
  // );
};
