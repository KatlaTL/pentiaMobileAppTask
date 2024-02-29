import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import RoomsListItem from "./RoomsListItem";
import firestore from '@react-native-firebase/firestore';
import { roomStyle } from "../../styles/roomStyle";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Main";

export type RoomListType = {
    room_id: string,
    room_name: string,
    description: string,
    total_messages: number,
    last_message: string,
    date_last_message: Date
}

type NavigationProps = NativeStackScreenProps<RootStackParamList, "RoomsList">;

const RoomsList = ({ navigation }: NavigationProps): React.JSX.Element => {
    const [rooms, setRooms] = useState<RoomListType[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const fetchRoomList = useCallback(() => {
        setRefreshing(true);

        firestore()
            .collection("rooms")
            .orderBy("date_created")
            .get()
            .then((rooms) => {
                const newRooms: RoomListType[] = [];
                rooms.forEach(value => {
                    const data = {
                        ...value.data(),
                        room_id: value.id,
                        date_last_message: value.data().date_last_message.toDate()
                    } as RoomListType;

                    newRooms.push({
                        room_id: data.room_id,
                        room_name: data.room_name,
                        description: data.description,
                        date_last_message: data.date_last_message,
                        last_message: data.last_message,
                        total_messages: data.total_messages
                    })
                })
                setRooms(newRooms);
            })
            .catch(err => console.error("Can't fetch rooms from firestore", err))
            .finally(() => setRefreshing(false))
    }, []);

    useEffect(() => {
        fetchRoomList();
    }, [])

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
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchRoomList} />}
        >
            {listOfRooms}
        </ScrollView>
    )
}

export default RoomsList;