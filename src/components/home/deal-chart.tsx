import { DollarOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { Text } from "../text";
import { Area, AreaConfig } from "@ant-design/plots";
import { useList } from "@refinedev/core";
import { DASHBOARD_DEALS_CHART_QUERY } from "@/graphql/queries";
import { mapDealsData } from "@/utilities/helpers";
import { useEffect, useMemo, useState } from "react";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { DashboardDealsChartQuery } from "@/graphql/types";

type StockData = {
  timeText: string; // Time in 12-hour format (e.g., '10:00 AM')
  value: number; // Closing price
  state: string; // Stock symbol
};

const DealsChart = () => {
  const {data} = useList<GetFieldsFromList <DashboardDealsChartQuery>>
  ({
      resource: 'dealStages',
      filters: [{ field: "title", operator: "in", value: ["WON", "LOST","NEW","FOLLOW-UP"] }],
      meta: {
          gqlQuery: DASHBOARD_DEALS_CHART_QUERY
      }
  })

  // console.log(data);
  // console.log(data?.data);

  const dealData = useMemo(() => {
      return mapDealsData(data?.data);
    }, [data?.data]);

  //   console.log(dealData);

  const config: AreaConfig = {
      data: dealData,
      isStack: false,
      xField: "timeText",
      yField: "value",
      seriesField: "state",
      animation: true,
      startOnZero: false,
      smooth: true,
      legend: {
        offsetY: -8,
      },
      yAxis: {
        tickCount: 7,
        label: {
          formatter: (v) => {
            return `$${Number(v) / 1000}k`;
          },
        },
      },
      tooltip: {
          formatter: (data) => {
            return {
              name: data.state,
              value: `$${Number(data.value) / 1000}k`,
            };
          },
        },
        areaStyle: (datum) => {
          const won = "l(270) 0:#ffffff 0.5:#b7eb8f 1:#52c41a";
          const lost = "l(270) 0:#ffffff 0.5:#f3b7c2 1:#ff4d4f";
          return { fill: datum.state === "Won" ? won : lost };
        },
        color: (datum) => {
          return datum.state === "Won" ? "#52C41A" : "#F5222D";
        },
        interactions: [
          {
            type: "element-highlight", // Highlight elements on hover
          },
          {
            type: "element-active", // Add active state to elements on click
          },
        ],
        state: {
          active: {
            style: {
              shadowColor: "rgba(0,0,0,0.4)",
              shadowBlur: 8,
              lineWidth: 2,
            },
          },
        },

  }

  // const [stockData, setStockData] = useState([]);

  // const fetchNvidiaStockData = async () => {
  //     const apiKey = 'C5rdWpCqikedZAkp8X1A_FmNstyg1Pil';
  //     const response = await fetch(
  //       `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NVDA&apikey=${apiKey}`
  //     );
  //     const data = await response.json();
  //     return data['Time Series (Daily)'];
  //   };

  // const fetchStockData = async (symbol) => {
  //   const apiKey = "cuj2nc1r01qm7p9n65t0cuj2nc1r01qm7p9n65tg";

  //   const now = Math.floor(Date.now() / 1000); // Current timestamp
  //   const oneDayAgo = now - 24 * 60 * 60; // 24 hours ago

  //   const response = await fetch(
  //     `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=5&from=${oneDayAgo}&to=${now}&token=${apiKey}`
  //     //   `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
  //   );
  //   const data = await response.json();
  //   console.log(data);

  //   return data["Time Series (Daily)"];
  // };

  // const transformStockData = (stockData, symbol) => {
  //   return Object.entries(stockData).map(([date, values]) => ({
  //     timeText: date,
  //     value: parseFloat(values["4. close"]), // Use closing price
  //     state: symbol, // Label for the stock (e.g., NVDA, NFLX, AMZN)
  //   }));
  // };

  // const fetchAllStockData = async () => {
  //   const symbols = ["NVDA", "NFLX", "AMZN"];
  //   const allData = await Promise.all(
  //     symbols.map(async (symbol) => {
  //       const data = await fetchStockData(symbol);
  //       return transformStockData(data, symbol);
  //     })
  //   );
  //   return allData.flat(); // Combine all datasets into one
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await fetchAllStockData();
  //     setStockData(data);
  //   };
  //   fetchData();
  // }, []);

  // const config = {
  //   data: stockData,
  //   xField: "timeText",
  //   yField: "value",
  //   seriesField: "state", // Differentiate stocks by their symbol
  //   animation: true,
  //   startOnZero: false,
  //   smooth: true,
  //   legend: {
  //     offsetY: -8,
  //   },
  //   yAxis: {
  //     tickCount: 7,
  //     label: {
  //       formatter: (v) => `$${Number(v).toFixed(2)}`, // Format as currency
  //     },
  //   },
  //   tooltip: {
  //     formatter: (data) => ({
  //       name: data.state,
  //       value: `$${Number(data.value).toFixed(2)}`,
  //     }),
  //   },
  //   areaStyle: (datum) => {
  //     const gradients = {
  //       NVDA: "l(270) 0:#ffffff 0.5:#a6d5ed 1:#1890ff", // NVIDIA gradient
  //       NFLX: "l(270) 0:#ffffff 0.5:#f3b7c2 1:#ff4d4f", // Netflix gradient
  //       AMZN: "l(270) 0:#ffffff 0.5:#ffd591 1:#fa8c16", // Amazon gradient
  //     };
  //     return { fill: gradients[datum.state] };
  //   },
  //   color: (datum) => {
  //     const colors = {
  //       NVDA: "#1890ff", // NVIDIA color
  //       NFLX: "#ff4d4f", // Netflix color
  //       AMZN: "#fa8c16", // Amazon color
  //     };
  //     return colors[datum.state];
  //   },
  //   interactions: [
  //     {
  //       type: "element-highlight", // Highlight on hover
  //     },
  //     {
  //       type: "element-active", // Add active state on click
  //     },
  //   ],
  //   state: {
  //     active: {
  //       style: {
  //         shadowColor: "rgba(0,0,0,0.4)",
  //         shadowBlur: 8,
  //         lineWidth: 2,
  //       },
  //     },
  //   },
  //   onEvent: (chart, event) => {
  //     if (event.type === "click") {
  //       const { x, y } = event;
  //       const point = chart.getTooltipItems({ x, y })[0];
  //       if (point) {
  //         const date = point.data.timeText;
  //         const price = point.data.value;
  //         const symbol = point.data.state;
  //         alert(`Date: ${date}\nStock: ${symbol}\nPrice: $${price.toFixed(2)}`);
  //       }
  //     }
  //   },
  // };

  return (
    <>
      {/* <Card
        style={{ height: "100%" }}
        headStyle={{ padding: "8px 16px" }}
        bodyStyle={{ padding: "24px 24px 0px 24px" }}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DollarOutlined />
            <Text size="sm" style={{ marginLeft: ".5rem" }}>
              Stock Price Comparison (NVDA, NFLX, AMZN)
            </Text>
          </div>
        }
      >
        <Area {...config} style={{ height: "380px" }} />
      </Card> */}

      <Card
      style={{ height: "100%" }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{ padding: "24px 24px 0px 24px" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <DollarOutlined />
          <Text size="sm" style={{ marginLeft: ".5rem" }}>
            Deals
          </Text>
        </div>
      }
    >

        
      <Area {...config} style={{height: '380px'}}/>
      
    </Card>
    </>
  );
};

export default DealsChart;
