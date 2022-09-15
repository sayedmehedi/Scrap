export const currencyTransform = {
  input: (value: number) => (isNaN(value) || value === 0 ? "$0" : `$${value}`),
  output: (value: string) => {
    const [, price] = value.split("$");
    const output = parseInt(price, 10);
    return isNaN(output) ? 0 : output;
  },

  inputFloat: (value: number) =>
    isNaN(value) || value === 0 ? "$0.0" : `$${value}`,
  outputFloat: (value: string) => {
    const [, price] = value.split("$");
    const output = parseFloat(price);
    return isNaN(output) ? 0.0 : output;
  },
};
