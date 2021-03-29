import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true,
});

export const systemStyle = (theme) => ({
  system: {
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows["3"],
    border: `solid 1px ${theme.palette.text.hint}`,
    fontFamily: "Roboto Mono, monospace",
    fontStyle: "italic",
    color: theme.palette.info.light,
  },
});

const systemHelper = (classes) => (handlebarsOptions, { genmo }) => {
  const content = md.renderInline(handlebarsOptions.fn(genmo.getData()));
  return `<div class=${classes.system}>${content}</div>`;
};

export default systemHelper;
