import { FlatList, RefreshControl } from "react-native";
import { ListItem } from "./list-item";
import { ChatRoomListType } from "../../../redux/reducers/chatRoomListSlice";
import { roomStyle } from "../../../assets/styles/roomStyle";
import { useCallback } from "react";

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

    const renderItem = useCallback(({ item, index }: { item: ChatRoomListType, index: number }) => {
        return <ListItem
            {...item}
            handleClick={() => handleRoomClick(item.chat_id, item.chat_name)}
            key={item.chat_name + index}
        />
    }, [])

    return (
        <FlatList
            contentContainerStyle={roomStyle.roomList}
            data={chatRooms}
            renderItem={renderItem}
            keyExtractor={(item: ChatRoomListType) => item.chat_id}
            overScrollMode="never"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getRoomList} />}
        />
    )
}