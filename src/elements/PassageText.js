import { Grid, makeStyles, Paper } from "@material-ui/core";
import React, { Fragment } from "react";
import { Prompt } from "./Prompt";
import ReactMarkdown from "react-markdown";
import PassageComponents from "./PassageComponents";

const useStyles = makeStyles((theme) => ({
  passage: {
    minHeight: theme.spacing(40),
    "& pre": {
      whiteSpace: "pre-line",
    },
    "& code": {
      background: theme.palette.background.paper,
      border: `solid 1px ${theme.palette.grey["600"]}`,
      borderRadius: theme.shape.borderRadius,
      padding: `0 ${theme.spacing(0.7)}px`,
      color: theme.palette.info.light,
      fontFamily: "Roboto Mono, monospace",
    },
  },
  title: {
    ...theme.typography.h5,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
}));

const outputPassageText = (textSrc) => {
  const textParts = textSrc.split(/\n===(\n|$)/);
  return (
    <Fragment>
      {textParts.map((text, i) => {
        let jsonResult = null;
        try {
          jsonResult = JSON.parse(text);
        } catch (e) {}
        if (
          jsonResult &&
          jsonResult.component &&
          PassageComponents[jsonResult.component]
        ) {
          const data = jsonResult.data || {};
          const PassageComponent = PassageComponents[jsonResult.component];
          return <PassageComponent {...data} key={i} />;
        } else {
          return (
            <ReactMarkdown key={i} allowDangerousHtml={true}>
              {text}
            </ReactMarkdown>
          );
        }
      })}
    </Fragment>
  );
};
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
