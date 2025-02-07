

import { Card, Skeleton } from 'antd';
import React from 'react'
import { Text } from '../text';
import { Area, AreaConfig } from '@ant-design/plots';
import { totalCountVariants } from '@/constants/';
import { config } from 'process';

type Type = "companies" | "contacts" | "deals";

type Props = {
  resource: "companies" | "contacts" | "deals";
  isLoading: boolean;
  totalCount?: number;
};

const DashboardTotalCountCard = ({resource, isLoading, totalCount}: Props) => {

    console.log(resource);
    

    

    const { primaryColor, secondaryColor, icon, title } = totalCountVariants[resource];


    const config: AreaConfig = {
        appendPadding: [1, 0, 0, 0],
        padding: 0,
        syncViewPadding: true,
        data: totalCountVariants[resource].data,
        autoFit: true,
        tooltip: false,
        animation: false,
        xField: "index",
        yField: "value",
        xAxis: false,
        yAxis: {
          tickCount: 12,
          label: {
            style: {
              fill: "transparent",
            },
          },
          grid: {
            line: {
              style: {
                stroke: "transparent",
              },
            },
          },
        },
        smooth: true,
        areaStyle: () => {
          return {
            fill: `l(270) 0:#fff 0.2:${secondaryColor} 1:${primaryColor}`,
          };
        },
        line: {
          color: primaryColor,
        },
    }

    
  return (
    
    <Card
    style={{ height: "96px", padding: 0 }}
    bodyStyle={{
      padding: "8px 8px 8px 12px",
    }}
    size="small"
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      <Text size="md" className="secondary" style={{ marginLeft: "8px" }}>
        {title}
      </Text>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Text
        size="xxxl"
        strong
        style={{
          flex: 1,
          whiteSpace: "nowrap",
          flexShrink: 0,
          textAlign: "start",
          marginLeft: "48px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {isLoading ? (
          <Skeleton.Button
            style={{
              marginTop: "8px",
              width: "74px",
            }}
          />
        ) : (
          totalCount
        )}
      </Text>
      <Area
        {...config}
        style={{
          width: "50%",
        }}
      />
    </div>
  </Card>
  )
}


export default DashboardTotalCountCard;