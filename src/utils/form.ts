export const currencyTransform = {
  input: (value: number) => (isNaN(value) || value === 0 ? "$0" : `$${value}`),
  output: (value: string) => {
    const [, bidPrice] = value.split("$");
    const output = parseInt(bidPrice, 10);
    return isNaN(output) ? 0 : output;
  },
};
