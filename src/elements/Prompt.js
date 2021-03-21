import { Button, TextField, makeStyles, Paper } from "@material-ui/core";
import React, { useState } from "react";
import {
  allPromptsResponded,
  getNeededPrompts,
} from "../utils/promptFunctions";
import { statName } from "../strings";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    background: theme.palette.background.paper,
    "& > form > *": {
      margin: theme.spacing(1),
    },
  },
}));

export const Prompt = ({ passage, onPromptResponded }) => {
  const [promptValues, setPromptValues] = useState({});
  const classes = useStyles();
  if (allPromptsResponded(passage)) return null;

  return (
    <Paper className={classes.formContainer}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onPromptResponded(promptValues);
        }}
      >
        <div>
          {getNeededPrompts(passage).map((prompt) => (
            <TextField
              key={prompt.key}
              id={prompt.key}
              label={statName(prompt.key)}
              value={promptValues[prompt.key] || ""}
              onChange={(e) =>
                setPromptValues({
                  ...promptValues,
                  [prompt.key]: e.target.value,
                })
              }
            />
          ))}
        </div>
        <Button
          variant="contained"
          color="secondary"
          onClick={(e) => {
            onPromptResponded(promptValues);
          }}
        >
          Submit
        </Button>
      </form>
    </Paper>
  );
};
