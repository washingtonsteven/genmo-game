import React from "react";
import {
  Grid,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  statName: {
    fontWeight: "bold",
  },
  container: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  tableTitle: {
    paddingLeft: theme.spacing(1),
  },
  table: {
    "& td, & th": {
      padding: theme.spacing(1),
    },
  },
}));

export const SidebarTable = ({
  data,
  tableTitle = "",
  aTitle = "A",
  bTitle = "B",
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} className={classes.container}>
      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.tableTitle} component="div">
          {tableTitle}
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>{aTitle}</TableCell>
              <TableCell>{bTitle}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className={classes.statName}>{key}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  );
};
