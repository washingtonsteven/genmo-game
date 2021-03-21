import React from "react";
import { itemName } from "../strings";
import { SidebarTable } from "./SidebarTable";

const inventoryFilter = ([item, quantity]) => quantity > 0;

const getInventory = (data) => {
  return Object.entries(data)
    .filter(inventoryFilter)
    .map(([key, value]) => {
      return [itemName(key), value.toString()];
    });
};

export const Inventory = ({ inventory = {} }) => {
  return (
    <SidebarTable
      data={getInventory(inventory)}
      aTitle="Item"
      bTitle="Quantity"
      tableTitle="Inventory"
    />
  );
};
