const helperMissing = (...fnArgs) => {
  const options = fnArgs[fnArgs.length - 1];
  // const args = Array.prototype.slice.call(fnArgs, 0, fnArgs.length - 1);
  return `<span class='handlebars-error'>Missing helper "${
    options.name
  }"</span>${options.fn(this)}`;
};

export default helperMissing;
