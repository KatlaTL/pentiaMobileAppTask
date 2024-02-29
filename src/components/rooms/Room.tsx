import React, { useEffect, useState } from "react";
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { roomStyle } from "../../styles/roomStyle";
import { colors } from "../../styles/colors";
import { useSelector } from 'react-redux';
import { selectUser } from "../../redux/reducers/userSlice";
import { RootStackParamList } from "../Main";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type messageType = {
    content: string,
    date_created: Date,
    type: string,
    uid: string,
    user_name: string
}

type NavigationProps = NativeStackScreenProps<RootStackParamList, "Room">;

const Room = ({ route }: NavigationProps): React.JSX.Element => {
    const { room_id, room_name } = route.params;
    const [messages, setMesages] = useState<messageType[]>([]);
    const [chatMessage, setChatMessage] = useState<string>("");
    const user = useSelector(selectUser);
    const fetchLimit = 50;

    const sendMessage = () => {
        if (chatMessage.length === 0) {
            return
        }
        Keyboard.dismiss();

        const roomReference = firestore().collection("rooms").doc(room_id);

        firestore().runTransaction(async transaction => {
            const roomSnapshot = await transaction.get(roomReference);

            if (!roomSnapshot.exists) {
                throw "Room does not exisit";
            }

            transaction.set(roomReference.collection("messages").doc(), {
                content: chatMessage,
                date_created: firestore.FieldValue.serverTimestamp(),
                type: "text",
                uid: user?.uid,
                user_name: user?.displayName
            })

            transaction.update(roomReference, {
                total_messages: firestore.FieldValue.increment(1),
                date_last_message: new Date()
            })
        })
            .then(() => setChatMessage(""))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        const unsubscribe = firestore()
            .collection("rooms")
            .doc(room_id)
            .collection("messages")
            .orderBy("date_created")
            .limit(fetchLimit)
            .onSnapshot((data) => {
                const arr: messageType[] = [];
                data.forEach(value => {
                    const data = {
                        ...value.data(),
                        date_created: value.data().date_created.toDate()
                    } as messageType;
                    arr.push(data);
                });
                setMesages(arr);
            }, (err) => console.log(err))

        return () => unsubscribe();
    }, [])

    const renderItem = ({ item }) => {
        const style = item.uid === user?.uid ? [roomStyle.chatSelfBubble, colors.chatBubbleSelfBackgroundColor] : [roomStyle.chatBubble, colors.chatBubbleBackgroundColor];
        return (
            <View>
                {item.uid != user?.uid && <Text style={roomStyle.chatUser}>{item.user_name}</Text>}
                <View style={style}>
                    <Text style={[colors.blackTextColor, roomStyle.chatBubbleText]}>{item.content}</Text>
                </View>
            </View>
        )
    }

    return (
        <>
            <View>
                <Text style={roomStyle.chatHeading}>{room_name}</Text>
            </View>
            <FlatList
                contentContainerStyle={roomStyle.chatFlatList}
                overScrollMode="never"
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.content + index}
                inverted
            />
            <View style={roomStyle.chatInputWrapper}>
                <TextInput
                    style={roomStyle.chatInputField}
                    placeholder="Aa"
                    placeholderTextColor={"gray"}
                    onChangeText={text => setChatMessage(text)}
                    defaultValue={chatMessage}
                />
                <TouchableOpacity style={[roomStyle.chatButton, colors.blueBackgroundColor]} onPress={sendMessage} disabled={chatMessage.length === 0}>
                    <Text style={[roomStyle.chatButtonText, colors.whiteTextColor]}>Send</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Room;