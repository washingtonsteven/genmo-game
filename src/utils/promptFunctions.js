export const getNeededPrompts = (passage) => {
  return (passage.needsPrompt || []).filter((prompt) => !prompt.complete);
};

export const allPromptsResponded = (passage) => {
  return getNeededPrompts(passage).length === 0;
};

const nameSplitRegex = new RegExp(/^([\w-.]+)\s+.*?\s*([\w-.]+)$/);

export const promptSideEffects = (setValues) => {
  const withSideEffects = { ...setValues };
  Object.entries(setValues).forEach(([key, value]) => {
    if (key === "name") {
      // Split name into firstname and lastname
      // Set name to firstname if we can't split it
      // This is very American English of me.
      const matches = value.match(nameSplitRegex);
      console.log(matches);
      let firstname = value;
      let lastname = "";
      if (matches) {
        firstname = matches[1];
        lastname = matches[2];
      }
      withSideEffects.firstname = firstname;
      withSideEffects.lastname = lastname;
    }
  });

  return withSideEffects;
};
