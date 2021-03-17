import { Grid, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  passage: {
    minHeight: "40vh",
  },
}));

export const PassageText = ({ passageText }) => {
  const classes = useStyles();
  return (
    <Grid item xs={12} className={classes.passage}>
      {passageText}
    </Grid>
  );
};
