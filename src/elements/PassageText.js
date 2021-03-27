import { Grid, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import { Prompt } from "./Prompt";
import ReactMarkdown from "react-markdown";

const useStyles = makeStyles((theme) => ({
  passage: {
    minHeight: theme.spacing(40),
  },
  title: {
    ...theme.typography.h5,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
}));

const outputPassageText = (text) => <ReactMarkdown>{text}</ReactMarkdown>;

export const PassageText = ({ passage, onPromptResponded }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Paper className={classes.title}>{passage.name}</Paper>
      </Grid>
      <Grid item xs={12} className={classes.passage}>
        {outputPassageText(passage.passageText)}
        <Prompt onPromptResponded={onPromptResponded} passage={passage} />
      </Grid>
    </React.Fragment>
  );
};
