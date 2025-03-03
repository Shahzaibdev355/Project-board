import React, { useEffect, useState } from 'react';
import { Area, AreaConfig } from '@ant-design/plots';

type StockData = {
  timeText: string; // Time in 12-hour format (e.g., '10:00 AM')
  value: number; // Closing price
  state: string; // Stock symbol
};

const fetchStockData = async (symbol: string): Promise<Record<string, any>> => {
  const apiKey = 'C5rdWpCqikedZAkp8X1A_FmNstyg1Pil';
  const response = await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${apiKey}`
  );
  const data = await response.json();
  return data['Time Series (60min)'];
};

const transformStockData = (stockData: Record<string, any>, symbol: string): StockData[] => {
  return Object.entries(stockData).map(([datetime, values]) => {
    const date = new Date(datetime);
    const timeText = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }); // Format as 12-hour time

    return {
      timeText,
      value: parseFloat(values['4. close']),
      state: symbol,
    };
  });
};

const fetchAllStockData = async (): Promise<StockData[]> => {
  const symbols = ['NVDA', 'NFLX', 'AMZN'];
  const allData = await Promise.all(
    symbols.map(async (symbol) => {
      const data = await fetchStockData(symbol);
      return transformStockData(data, symbol);
    })
  );
  return allData.flat();
};

const StockChart: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllStockData();
      setStockData(data);
    };
    fetchData();
  }, []);

  const config: AreaConfig = {
    data: stockData,
    xField: 'timeText',
    yField: 'value',
    seriesField: 'state',
    animation: true,
    startOnZero: false,
    smooth: true,
    legend: {
      offsetY: -8,
    },
    yAxis: {
      tickCount: 7,
      label: {
        formatter: (v: number) => v.toFixed(2), // Format price to 2 decimals
      },
    },
    tooltip: {
      formatter: (data: StockData) => ({
        name: data.state,
        value: `$${data.value.toFixed(2)}`,
      }),
    },
    areaStyle: (datum: StockData) => {
      const gradients: Record<string, string> = {
        NVDA: 'l(270) 0:#ffffff 0.5:#a6d5ed 1:#1890ff',
        NFLX: 'l(270) 0:#ffffff 0.5:#f3b7c2 1:#ff4d4f',
        AMZN: 'l(270) 0:#ffffff 0.5:#ffd591 1:#fa8c16',
      };
      return { fill: gradients[datum.state] };
    },
    color: (datum: StockData) => {
      const colors: Record<string, string> = {
        NVDA: '#1890ff',
        NFLX: '#ff4d4f',
        AMZN: '#fa8c16',
      };
      return colors[datum.state];
    },
    interactions: [
      {
        type: 'element-highlight',
      },
      {
        type: 'element-active',
      },
    ],
    state: {
      active: {
        style: {
          shadowColor: 'rgba(0,0,0,0.4)',
          shadowBlur: 8,
          lineWidth: 2,
        },
      },
    },
    onEvent: (chart, event) => {
      if (event.type === 'click') {
        const { x, y } = event;
        const point = chart.getTooltipItems({ x, y })[0];
        if (point) {
          const { timeText, value, state } = point.data;
          alert(`Time: ${timeText}\nStock: ${state}\nPrice: $${value.toFixed(2)}`);
        }
      }
    },
  };

  return <Area {...config} />;
};

export default StockChart;
