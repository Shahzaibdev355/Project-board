import { CalendarOutlined } from "@ant-design/icons"
import { Badge, Card, List } from "antd"
import { Text } from "../text"
import { useEffect, useState } from "react"
import UpcomingEventsSkeleton from "@/skeleton/upcoming-events"
import dayjs from "dayjs"

import { useList } from "@refinedev/core"
import { DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY } from "@/graphql/queries"


import { getDate } from "@/utilities/helpers"
import { client } from "@/provider"


// import type { DashboardCalendarUpcomingEventsQuery } from "@/graphql/types";

// import { DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY } from "./queries";




const UpcomingEvents = () => {


    const [isLoading, setIsLoading] = useState(false)

    const accessToken = localStorage.getItem("access_token");

    // const { data, isLoading: eventsLoading, error} = useList({
        
    //     resource: "events",
    //     meta: {
    //         gqlQuery: DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY,
    //         variables: {
    //             filter: {
    //                 startDate: { gte: dayjs().format("YYYY-MM-DD") },
    //             },
    //             sorting: [
    //                 { field: "startDate", direction: "ASC" },
    //             ],
    //             paging: {
    //                 offset: 0,
    //                 limit: 5,
    //             },
    //         },
    //     }
    // })

    // console.log("Data:", data);
    //     console.log("Loading:", eventsLoading);
    //     console.log("error:", error);
        
    




    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const variables = {
                    filter: {},
                    sorting: [{ field: "startDate", direction: "ASC" }],
    paging: { offset: 0, limit: 10 },
                };

                const response = await client.request(DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY, variables);
                setData(response.events.nodes); // Adjust based on the actual response structure
                console.log('Fetched events:', response.events.nodes);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array to ensure it only runs once

    console.log(data);
    




    // const { data, isLoading: eventsLoading, error } = useList({
    //     resource: "events",
    //     meta: {
    //         gqlQuery: DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY,
    //     },
    //     filters: [
    //         {
    //             field: "startDate",
    //             operator: "gte",
    //             value: new Date().toISOString(), 
    //         }
    //     ],
    //     sorters: [
    //         {
    //             field: "startDate",
    //             order: "asc"
    //         }
    //     ],
    //     pagination: {
    //         pageSize: 5,
    //         current: 1
    //     },
    //     queryOptions: {
    //         // Add this to see detailed errors
    //         onError: (error) => {
    //             console.log('GraphQL Error:', error);
    //         }
    //     }
    // })


    // Add this to debug
    // console.log('Query:', DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY);
    // console.log('Error:', error);
    // console.log('data', data);
    
    

    return ( 

       <Card
       style={{
        height: "100%",
      }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{
        padding: "0 1rem",
      }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CalendarOutlined />
          <Text size="sm" style={{ marginLeft: ".7rem" }}>
            Upcoming events
          </Text>
        </div>
      }
       >


        {isLoading ? (
            <List  itemLayout="horizontal"
            dataSource={Array.from({ length: 5 }).map((_, index) => ({
              id: index,
            }))}
            renderItem={() => <UpcomingEventsSkeleton/>}

            />

        ): (
            <List 
            itemLayout="horizontal" 

            // actual data will come
            dataSource={[]}
            renderItem={(item)=>{

                const renderDate = () => {
                    const start = dayjs(item.startDate).format(
                      "MMM DD, YYYY - HH:mm",
                    );
                    const end = dayjs(item.endDate).format("MMM DD, YYYY - HH:mm");
      
                    return `${start} - ${end}`;
                  }; 

                return(
                    <List.Item>
                    <List.Item.Meta
                      avatar={<Badge color={item.color} />}
                      title={<Text size="xs">{`${renderDate()}`}</Text>}
                      description={
                        <Text ellipsis={{ tooltip: true }} strong>
                          {item.title}
                        </Text>
                      }
                    />
                  </List.Item>
              
                )
            }}
            >

            </List>
        )}

       </Card> 

        
       
     );
}
 
export default UpcomingEvents;