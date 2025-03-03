import "../../assets/style.css"

import { Popover,Button } from "antd";
import CustomAvatar from "../custom-avatar";
import { useGetIdentity } from "@refinedev/core";

import type { User } from "@/graphql/schema.types";
import { Text } from "../text";
import { useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { AccountSettings } from "./account-setting";

const CurrentUser = () => {

    const [isOpen, setIsOpened] = useState(false);

    // will actually use our GetIdentity func made in auth
    const {data: user} = useGetIdentity<User>()

    const content = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
           
          }}
        >
          <Text
            strong
            style={{
              padding: "12px 20px",
            }}
          >
            {user?.name}
          </Text>
          <div
            style={{
              borderTop: "1px solid #d9d9d9",
              padding: "4px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <Button
              style={{ textAlign: "left" }}
              icon={<SettingOutlined />}
              type="text"
              block
              onClick={() => setIsOpened(true)}
            >
              Account settings
            </Button>
          </div>
        </div>
      );
    

    return ( 
        
        <>
        
        <Popover
        placement="bottomRight"
        trigger="click"
        content={content}
        
        >
                <CustomAvatar  
                name={user?.name}
                src={user?.avatarUrl}
                size="large"
                style={{cursor: "pointer"}}
                />
        </Popover>

        {
            user && ( <AccountSettings
                opened={isOpen}
                setOpened={setIsOpened}
                userId={user.id}
            />

            
        )}

        </>
     );
}
 
export default CurrentUser;