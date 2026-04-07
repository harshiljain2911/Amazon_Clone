/**
 * Formats a numeric price into a standard INR string (e.g., ₹1,299.00)
 */
export const formatPrice = (price = 0) => {
  return `₹${Number(price).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
};

/**
 * Splits a price into integer and decimal parts for Amazon-style display.
 * Example: 749.99 -> { int: "749", dec: "99" }
 */
export const splitPrice = (price = 0) => {
  const [int, dec] = Number(price).toFixed(2).split('.');
  return {
    int: Number(int).toLocaleString('en-IN'),
    dec: dec,
  };
};
