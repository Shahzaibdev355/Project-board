import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";
import Header from "./Header";
import React from "react";


const Layout = ({children}: React.PropsWithChildren) => {
    return ( 
        <>
        <ThemedLayoutV2
       
        Header={Header}
        Title={(titleProps)=> <ThemedTitleV2 {...titleProps} text="Planova" />}
        >
        {children}
        </ThemedLayoutV2>
        </>
     );
}
 
export default Layout;