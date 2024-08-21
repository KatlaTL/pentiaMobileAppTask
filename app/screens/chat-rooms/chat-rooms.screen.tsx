import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { ListItem } from "./_components/list-item";
import { roomStyle } from "../../assets/styles/roomStyle";
import { useAppDispatch } from "../../redux/store/store";
import { ChatRoomListType, fetchChatRoomList, selectChatRoomList } from "../../redux/reducers/chatRoomListSlice";
import { ChatRoomsNavigationProps } from "../../navigators/app.navigator";


const ChatRoomsScreen = ({ navigation }: ChatRoomsNavigationProps): React.JSX.Element => {
    const [chatRooms, setChatRooms] = useState<ChatRoomListType[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const appDispatch = useAppDispatch();
    const chatRoomList = useSelector(selectChatRoomList);

    const getRoomList = useCallback(() => {
        setRefreshing(true);
        appDispatch(fetchChatRoomList())
            .catch(err => console.error(err))
            .finally(() => setRefreshing(false));
    }, []);

    useEffect(() => getRoomList(), []);

    useEffect(() => setChatRooms(chatRoomList), [chatRoomList]);

    const listOfRooms = chatRooms.map((roomProps: ChatRoomListType, index) => {
        return <ListItem
            {...roomProps}
            handleClick={() => navigation.navigate("Chat", { chat_id: roomProps.chat_id, chat_name: roomProps.chat_name })}
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

export default ChatRoomsScreen;