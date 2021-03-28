import chatHelper, { chatStyle } from "./chat";

export const helperStyles = (theme) => ({
  ...chatStyle(theme),
});

export const getHelpers = (classes) => {
  return {
    chat: chatHelper(classes),
  };
};
