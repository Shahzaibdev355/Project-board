import { DollarOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { Text } from "../text";
import { Area, AreaConfig } from "@ant-design/plots";
import { useList } from "@refinedev/core";
import { DASHBOARD_DEALS_CHART_QUERY } from "@/graphql/queries";
import { mapDealsData } from "@/utilities/helpers";
import { useMemo } from "react";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { DashboardDealsChartQuery } from "@/graphql/types";


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

    return ( 
        <>
        
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
}
 
export default DealsChart;