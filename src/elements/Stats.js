import {
  Grid,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  statName: {
    fontWeight: "bold",
  },
}));

const getStats = (data) => {
  return Object.entries(data)
    .filter(([key, value]) => {
      return !Boolean(["inventory", "passage_data"].find((k) => k === key));
    })
    .map(([key, value]) => {
      return [key, value.toString()];
    });
};

export const Stats = ({ data }) => {
  const stats = getStats(data);
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.map(([stat, value]) => (
            <TableRow key={stat}>
              <TableCell className={classes.statName}>{stat}</TableCell>
              <TableCell>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Grid>
  );
};
