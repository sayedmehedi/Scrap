export const currencyTransform = {
  input: (value: number) =>
    isNaN(value) || value === 0 ? "$1.00" : `$${value}`,
  output: (value: string) => {
    const [, price] = value.split("$");
    const output = parseInt(price, 10);
    return isNaN(output) ? 0 : output;
  },

  inputFloat: (value: string) => {
    return `$${value}`;
  },
  outputFloat: (value: string) => {
    if (!/^\$\d*\.?\d*$/.test(value)) {
      return 0;
    }

    return value.replace(/\$/, "");
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
