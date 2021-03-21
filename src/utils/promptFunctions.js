export const getNeededPrompts = (passage) => {
  return (passage.needsPrompt || []).filter((prompt) => !prompt.complete);
};

export const allPromptsResponded = (passage) => {
  return getNeededPrompts(passage).length === 0;
};
