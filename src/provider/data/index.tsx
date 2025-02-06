// It is a client that will initialize with graphQL client
// to make request to graphQL Api

import graphqlDataProvider, 
{ GraphQLClient, 
liveProvider as graphqlLiveProvider 
} from "@refinedev/nestjs-query";

import { fetchWrapper } from "./fetch-wrapper";

import { createClient } from "graphql-ws";


// API_URL == To know from where we are getting data from
export const API_BASE_URL = "https://api.crm.refine.dev";
export const API_URL = `${API_BASE_URL}/graphql`
export const WSS_URL = "wss://api.crm.refine.dev/graphql";


export const client = new GraphQLClient(API_URL,{

    

    fetch : ( url:string, options:RequestInit) =>{

        const accessToken = localStorage.getItem("access_token");

        try {
            options.headers = {
                 ...options.headers,
                 Authorization: `Bearer ${accessToken}`,
            };
            return fetchWrapper(url,options)
        } catch (error) {
            return Promise.reject(error as Error)
        }
    }
})


// export const client = new GraphQLClient(API_URL, {
//     fetch: (url: string, options: RequestInit) => {
//         const accessToken = localStorage.getItem("access_token");
//         options.headers = {
//             ...options.headers,
//             Authorization: `Bearer ${accessToken}`,
//         };
//         return fetchWrapper(url, options);
//     },
// });


export const wsClient = typeof window !== "undefined" ? 
createClient ({
    url: WSS_URL,
    connectionParams: ()=>{
        const accessToken = localStorage.getItem("access_token")
        return{
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    }
}) : undefined


export const dataProvider = graphqlDataProvider(client)
export const liveProvider = wsClient ? graphqlLiveProvider(wsClient) : undefined