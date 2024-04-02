import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import RoomsListItem from "./RoomsListItem";
import { roomStyle } from "../../styles/roomStyle";
import { RootStackParamList } from "../Main";
import { useAppDispatch } from "../../redux/store/store";
import { RoomListType, fetchRoomList, selectRoomList } from "../../redux/reducers/roomListSlice";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "RoomsList">;

const RoomsList = ({ navigation }: NavigationProps): React.JSX.Element => {
    const [rooms, setRooms] = useState<RoomListType[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const appDispatch = useAppDispatch();
    const roomList = useSelector(selectRoomList);

    const getRoomList = useCallback(() => {
        setRefreshing(true);
        appDispatch(fetchRoomList())
            .catch(err => console.error(err))
            .finally(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        getRoomList();
    }, [])

    useEffect(() => setRooms(roomList), [roomList])

    const listOfRooms = rooms.map((roomProps: RoomListType, index) => {
        return <RoomsListItem
            {...roomProps}
            handleClick={() => navigation.navigate("Room", { room_id: roomProps.room_id, room_name: roomProps.room_name })}
            key={roomProps.room_name + index}
        />
    })

    return (
        <ScrollView
            contentContainerStyle={roomStyle.roomList}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getRoomList} />}
        >
            {listOfRooms}
        </ScrollView>
    )
}

export default RoomsList;