import { Button, TextField, makeStyles, Paper } from "@material-ui/core";
import React, { useState } from "react";
import {
  allPromptsResponded,
  getNeededPrompts,
  promptSideEffects,
} from "../utils/promptFunctions";
import { promptDefault, statName } from "../strings";

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

  const doPromptResponse = () => {
    const setValues = { ...promptValues };
    getNeededPrompts(passage).forEach((prompt) => {
      if (promptDefault(prompt.key)) {
        setValues[prompt.key] =
          setValues[prompt.key] || promptDefault(prompt.key);
      }
    });
    const valuesWithSideEffects = promptSideEffects(setValues);
    onPromptResponded(valuesWithSideEffects);
  };

  return (
    <Paper className={classes.formContainer}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          doPromptResponse();
        }}
      >
        <div>
          {getNeededPrompts(passage).map((prompt) => {
            return (
              <TextField
                key={prompt.key}
                id={prompt.key}
                label={statName(prompt.key)}
                InputLabelProps={{ shrink: true }}
                value={promptValues[prompt.key] || ""}
                placeholder={promptDefault(prompt.key)}
                variant="outlined"
                onChange={(e) =>
                  setPromptValues({
                    ...promptValues,
                    [prompt.key]: e.target.value,
                  })
                }
              />
            );
          })}
        </div>
        <Button
          variant="contained"
          color="secondary"
          onClick={(e) => {
            doPromptResponse();
          }}
        >
          Submit
        </Button>
      </form>
    </Paper>
  );
};
