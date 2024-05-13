const DATA_BASE_URL = "https://fakestoreapi.com/products/";

  const TARGETDATE = new Date("may 08, 2024, 00:00:00").getTime();
  
  const CURRENCYFORMATER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
})

export { DATA_BASE_URL, TARGETDATE, CURRENCYFORMATER}