import { Avatar as AntdAvatar, AvatarProps } from "antd";

import {getNameInitials} from "@/utilities"

type Props = AvatarProps & {
    name?: string
}

const CustomAvatar = ({name, style, ...rest}: Props) => {
    return ( 
        <AntdAvatar 
        alt={name}
        size="small" 
        style={{display: 'flex', alignItems:'center', ...style}} 
        {...rest} 
        >

        {getNameInitials(name || '')}
        </AntdAvatar>
     );
}
 
export default CustomAvatar;