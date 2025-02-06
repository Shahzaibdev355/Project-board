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
        
    




    
    
    // useEffect(() => {
    //     const fetchData = async () => {
           

    //         try {
    //             const variables = {
    //                 filter: {},
    //                 sorting: [{ field: "startDate", direction: "ASC" }],
    // paging: { offset: 0, limit: 10 },
    //             };

    //             const response = await client.request(DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY, variables);
    //             console.log('Fetched events:', response.events.nodes);

    //         } catch (err) {
    //             console.log(err);
                
    //         }
    //     };

    //     fetchData();
    // }, []); 

    // console.log(data);






    // const [data, setData] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);




    const { data, isLoading: eventsLoading } = useList({
        resource: "events",
        pagination: {
            pageSize: 5
          },
          sorters: [{ field: "startDate", order: "asc" }],
         

        meta: {
            gqlQuery: DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY,
            variables: {
                filters: [
                    {
                      field: "startDate",
                      operator: "gte",
                      value: dayjs().format("YYYY-MM-DD"),
                    },
                  ],
                paging: { offset: 0, limit: 10 },
                
            },
        },
    });
    
    useEffect(() => {

        setIsLoading(eventsLoading);

        if (!eventsLoading) {
            console.log("Fetched shahzaib data:", data);
            // Perform any additional logic with `data` here if necessary
        }
    }, [data, eventsLoading]);










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
            dataSource={data?.data || []}
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