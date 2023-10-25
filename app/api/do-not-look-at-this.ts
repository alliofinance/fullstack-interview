export const getFakeData = () => {
  const dateData: Record<string, any> = {};
  const startDate = new Date("1999-01-01");
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  let val = Math.random() * 100;

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayData = {
      "1. open": val,
      "2. high": val + Math.random() * 10,
      "3. low": val - Math.random() * 10,
      "4. close": val + Math.random() * 5 - Math.random() * 5,
      "5. volume": Math.random() * 1000000,
    };
    val = dayData["4. close"];
    const formattedDate = new Date(d).toISOString().split("T")[0];

    dateData[formattedDate] = dayData;
  }

  return {
    "Time Series (Daily)": dateData,
  };
};
