const errorAnalize = (element) => {
  if (element && element.includes("E11000")) {
    return "Duplicate key error: The data already exists.";
  }
  return element;
};

export default errorAnalize;
