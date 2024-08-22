import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/store/store";
import { ChatRoomListType, fetchChatRoomList, selectChatRoomList } from "../../redux/reducers/chatRoomListSlice";
import { ChatRoomsNavigationProps } from "../../navigators/app.navigator";
import { ChatRoonsPresentation } from "./_components/chat-rooms-presentation";


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

    const handleRoomClick = (chat_id: string, chat_name: string) => navigation.navigate("Chat", { chat_id: chat_id, chat_name: chat_name });

    return <ChatRoonsPresentation
        chatRooms={chatRooms}
        getRoomList={getRoomList}
        handleRoomClick={handleRoomClick}
        refreshing={refreshing}
    />
}

export default ChatRoomsScreen;