import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import RoomListItem from "./RoomListItem";
import firestore from '@react-native-firebase/firestore';
import { roomStyle } from "../../styles/roomStyle";

export type RoomListType = {
    room_id: string,
    room_name: string,
    description: string,
    total_messages: number,
    last_message: string,
    date_last_message: Date
}

const RoomsList = (): React.JSX.Element => {
    const [rooms, setRooms] = useState<RoomListType[]>([]);

    const fetchRoomList = () => {
        firestore().collection("rooms").get()
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
    }

    useEffect(() => {
        fetchRoomList();
    }, [])

    const listOfRooms = rooms.map((roomProps: RoomListType, index) => <RoomListItem {...roomProps} key={roomProps.room_name + index} />)

    return (
        <ScrollView contentContainerStyle={roomStyle.roomList}>
            {listOfRooms}
        </ScrollView>
    )
}

export default RoomsList;