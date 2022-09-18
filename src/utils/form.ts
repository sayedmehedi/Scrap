export const currencyTransform = {
  input: (value: number) => (isNaN(value) || value === 0 ? "$0" : `$${value}`),
  output: (value: string) => {
    const [, price] = value.split("$");
    const output = parseInt(price, 10);
    return isNaN(output) ? 0 : output;
  },

  inputFloat: (value: string) => {
    return value === "" ? "$0.0" : `$${value}`;
  },
  outputFloat: (value: string) => {
    const [, price] = value.split("$");

    return price;
  },
};

export const numberTransform = {
  input: (value: number) =>
    isNaN(value) || value === 0 ? "" : value.toString(),
  output: (value: string) => {
    const output = parseInt(value, 10);
    return isNaN(output) ? 0 : output;
  },
};

export const dayTransform = {
  input: (value: number) =>
    isNaN(value) || value === 0 ? "" : `${value} days`,
  output: (value: string) => {
    value = value.replace(/(\d+)\s\w+/, "$1");
    const output = parseInt(value, 10);
    return isNaN(output) ? 0 : output;
  },
};
