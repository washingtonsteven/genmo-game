import { Grid, Button, makeStyles } from "@material-ui/core";
import React from "react";
import { useKeyPressAction } from "../utils/useKeyPressAction";

const useStyles = makeStyles((theme) => ({
  grid: {
    textAlign: "center",
    "& > *": {
      marginBottom: theme.spacing(3),
      padding: `0 ${theme.spacing(1)}px`,
    },
  },
  shortcut: {
    ...theme.typography.caption,
    position: "absolute",
    right: theme.spacing(0.625),
    top: theme.spacing(0.125),
    fontSize: "0.6rem",
  },
  button: {
    maxWidth: "100%",
  },
}));

const directionals = ["north", "south", "east", "west"];
const splitLinks = (links = []) => {
  const isDirectional = (link) =>
    Boolean(
      directionals.find((d) => d.toLowerCase() === link.name.toLowerCase())
    );
  const directionalLinks =
    links
      .filter((link) => isDirectional(link))
      .reduce((dir, link) => {
        dir[link.name.toLowerCase()] = link;
        return dir;
      }, {}) || {};
  const otherLinks = links.filter((link) => !isDirectional(link)) || [];

  return { directionalLinks, otherLinks };
};

// const outputLink = (link, onClick, altText = null, customOpts = {}) => {
const outputLink = ({
  link,
  onClick,
  altText,
  shortcut,
  buttonOverrides = {},
}) => {
  const onClickFn = () => {
    typeof onClick === "function" && onClick(link);
  };
  const buttonOpts = {
    variant: "contained",
    ...buttonOverrides,
  };
  const shortcutElem = shortcut ? (
    <div className={shortcut.shortcutClassName}>{shortcut.text}</div>
  ) : (
    ""
  );
  if (link) {
    return (
      <Button onClick={onClickFn} {...buttonOpts}>
        {altText || link.name}
        {shortcutElem}
      </Button>
    );
  } else if (altText !== null) {
    return (
      <Button {...buttonOpts} disabled>
        {altText}
        {shortcutElem}
      </Button>
    );
  }
};

export const Links = ({ links, onLinkClicked, disabled = false }) => {
  const classes = useStyles();
  const { directionalLinks, otherLinks } = splitLinks(links);
  const defaultDirectionalButtonOverrides = {
    color: "primary",
    className: classes.button,
  };

  const doLinkClick = (link) => {
    if (link) onLinkClicked(link);
  };

  useKeyPressAction({
    up: () => doLinkClick(directionalLinks.north),
    down: () => doLinkClick(directionalLinks.south),
    left: () => doLinkClick(directionalLinks.west),
    right: () => doLinkClick(directionalLinks.east),
    ...otherLinks.slice(0, 9).reduce((obj, link, index) => {
      obj[index + 1] = () => doLinkClick(link);
      return obj;
    }, {}),
  });

  const outputDirectionalLink = (link, altText = null, shortcut) =>
    outputLink({
      link,
      altText,
      onClick: onLinkClicked,
      buttonOverrides: {
        ...defaultDirectionalButtonOverrides,
        disabled,
      },
      shortcut: {
        text: shortcut,
        shortcutClassName: classes.shortcut,
      },
    });

  return (
    <Grid item xs={12}>
      <Grid container className={classes.grid}>
        <Grid item xs={12} md={6}>
          <Grid container justify="center" alignItems="center" spacing={1}>
            <Grid item xs={12}>
              {outputDirectionalLink(directionalLinks.north, "North", "W")}
            </Grid>
            <Grid item xs={6}>
              {outputDirectionalLink(directionalLinks.west, "West", "A")}
            </Grid>
            <Grid item xs={6}>
              {outputDirectionalLink(directionalLinks.east, "East", "D")}
            </Grid>
            <Grid item xs={12}>
              {outputDirectionalLink(directionalLinks.south, "South", "S")}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            {otherLinks.map((link, index) => (
              <Grid item lg={3} md={4} sm={6} xs={12} key={link.pid}>
                {outputLink({
                  link,
                  onClick: onLinkClicked,
                  shortcut: index < 9 && {
                    text: index + 1,
                    shortcutClassName: classes.shortcut,
                  },
                  buttonOverrides: {
                    disabled,
                    className: classes.button,
                  },
                })}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
