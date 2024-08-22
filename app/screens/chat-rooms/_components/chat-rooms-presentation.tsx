import { RefreshControl, ScrollView } from "react-native";
import { ListItem } from "./list-item";
import { ChatRoomListType } from "../../../redux/reducers/chatRoomListSlice";
import { roomStyle } from "../../../assets/styles/roomStyle";

type ChatRoomPresentationType = {
    chatRooms: ChatRoomListType[];
    handleRoomClick: (chat_id: string, chat_name: string) => void;
    refreshing: boolean;
    getRoomList: () => void;
}

/**
 * Chat Rooms Presentations 
 */
export const ChatRoomsPresentation = ({ chatRooms, handleRoomClick, refreshing, getRoomList }: ChatRoomPresentationType): React.JSX.Element => {

    const listOfRooms = chatRooms.map((roomProps: ChatRoomListType, index) => {
        return <ListItem
            {...roomProps}
            handleClick={() => handleRoomClick(roomProps.chat_id, roomProps.chat_name)}
            key={roomProps.chat_name + index}
        />
    });

    return (
        <ScrollView
            contentContainerStyle={roomStyle.roomList}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getRoomList} />}
        >
            {listOfRooms}
        </ScrollView>
    )
}