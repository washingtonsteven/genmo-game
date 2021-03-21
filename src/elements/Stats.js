import React from "react";
import { statName } from "../strings";
import { SidebarTable } from "./SidebarTable";

const getStats = (data) => {
  return Object.entries(data)
    .filter(([key, value]) => {
      return !Boolean(["inventory", "passage_data"].find((k) => k === key));
    })
    .map(([key, value]) => {
      return [statName(key), value.toString()];
    });
};

export const Stats = ({ data }) => {
  return (
    <SidebarTable
      data={getStats(data)}
      aTitle="Name"
      bTitle="Value"
      tableTitle="Stats"
    />
  );
};
