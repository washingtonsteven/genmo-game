export const statLookup = {
  money: "Money",
  player_name: "Player Name",
};

export const promptDefaults = {
  username: "ada",
};

export const statName = (stat) => statLookup[stat] || stat;

export const promptDefault = (stat) => promptDefaults[stat];
