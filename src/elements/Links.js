import { Grid, Button, makeStyles } from "@material-ui/core";
import React from "react";
import { useKeyPressAction } from "../utils/useKeyPressAction";

const useStyles = makeStyles((theme) => ({
  grid: {
    textAlign: "center",
  },
  shortcut: {
    position: "absolute",
    right: 5,
    top: 1,
    fontSize: "0.6rem",
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

const outputLink = (link, onClick, altText = "", customOpts = {}) => {
  const onClickFn = () => {
    typeof onClick === "function" && onClick(link);
  };
  const buttonOpts = {
    variant: "contained",
    ...customOpts.buttonOpts,
  };
  const shortcut = customOpts.shortcut ? (
    <div className={customOpts.shortcutClassName}>{customOpts.shortcut}</div>
  ) : (
    ""
  );
  if (link) {
    return (
      <Button onClick={onClickFn} {...buttonOpts}>
        {link.name}
        {shortcut}
      </Button>
    );
  } else {
    return (
      <Button disabled {...buttonOpts}>
        {altText}
        {shortcut}
      </Button>
    );
  }
};

export const Links = ({ links, onLinkClicked }) => {
  const classes = useStyles();
  const { directionalLinks, otherLinks } = splitLinks(links);
  const defaultDirectionalButtonOpts = {
    buttonOpts: { color: "primary" },
    shortcutClassName: classes.shortcut,
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

  return (
    <Grid item xs={12}>
      <Grid container className={classes.grid}>
        <Grid item xs={6}>
          <Grid container justify="center" alignItems="center" spacing={1}>
            <Grid item xs={12}>
              {outputLink(directionalLinks.north, onLinkClicked, "North", {
                ...defaultDirectionalButtonOpts,
                shortcut: "W",
              })}
            </Grid>
            <Grid item xs={4}>
              {outputLink(directionalLinks.west, onLinkClicked, "West", {
                ...defaultDirectionalButtonOpts,
                shortcut: "A",
              })}
            </Grid>
            <Grid item xs={4}>
              {outputLink(directionalLinks.south, onLinkClicked, "South", {
                ...defaultDirectionalButtonOpts,
                shortcut: "S",
              })}
            </Grid>
            <Grid item xs={4}>
              {outputLink(directionalLinks.east, onLinkClicked, "East", {
                ...defaultDirectionalButtonOpts,
                shortcut: "D",
              })}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={1}>
            {otherLinks.map((link, index) => (
              <Grid item xs={4} key={link.pid}>
                {outputLink(link, onLinkClicked, null, {
                  shortcutClassName: classes.shortcut,
                  shortcut: index < 9 ? index + 1 : null,
                })}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
