const compare = (a, b) => {
  if (b.nextRunAt - a.nextRunAt > 0) {
    return -1;
  }
  if (b.nextRunAt - a.nextRunAt < 0) {
    return 1;
  }
  return 0;
};

module.exports = { compare };
