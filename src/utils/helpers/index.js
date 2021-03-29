import chatHelper, { chatStyle } from "./chat";
import systemHelper, { systemStyle } from "./system";
// import helperMissing from "./helperMissing"; TODO: Fix helperMissing

export const helperStyles = (theme) => ({
  ...chatStyle(theme),
  ...systemStyle(theme),
});

export const getHelpers = (classes) => {
  return {
    chat: chatHelper(classes),
    system: systemHelper(classes),
    // helperMissing,
  };
};
