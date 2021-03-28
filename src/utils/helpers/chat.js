import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true,
});

export const chatStyle = (theme) => ({
  chat: {
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    margin: `${theme.spacing(1)}px 0 ${theme.spacing(4)}px`,
    boxShadow: theme.shadows["3"],
    "& code": {
      background: theme.palette.background.default,
    },
    "& strong": {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.pxToRem(theme.typography.fontSize),
      color: theme.palette.warning.light,
      "&[data-name='System']": {
        color: theme.palette.info.light,
        "&+span": {
          fontFamily: "Roboto Mono, monospace",
        },
      },
    },
  },
});

const chatHelper = (classes) => (handlebarsOptions, { genmo }) => {
  const content = handlebarsOptions.fn(genmo.getData());
  const contentLines = content.split(/(?:\r|\n)/);
  const namesBolded = contentLines
    .map((line) =>
      line.replace(
        /^(\w+):(.*)$/,
        `<strong data-name="$1">$1:</strong><span>$2</span>`
      )
    )
    .join("\n");
  const markDown = md.render(namesBolded);
  return `<div class=${classes.chat}>${markDown}</div>`;
};

export default chatHelper;
