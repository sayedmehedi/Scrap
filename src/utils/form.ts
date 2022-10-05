export const currencyTransform = {
  input: (value: number) => {
    return `$${value}`;
  },
  output: (currency: string) => {
    let replaced = currency.replace(/[^0-9.-]+/g, "");

    // @ts-ignore
    return replaced as number;
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
