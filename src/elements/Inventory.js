import {
  Grid,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import { itemName } from "../strings";

const useStyles = makeStyles((theme) => ({
  itemName: {
    ...theme.typography.h6,
    fontSize: "1rem",
  },
}));

const inventoryFilter = ([item, quantity]) => quantity > 0;

export const Inventory = ({ inventory = {} }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(inventory)
            .filter(inventoryFilter)
            .map(([item, quantity]) => (
              <TableRow key={item}>
                <TableCell className={classes.itemName}>
                  {itemName(item)}
                </TableCell>
                <TableCell>{quantity}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Grid>
  );
};
