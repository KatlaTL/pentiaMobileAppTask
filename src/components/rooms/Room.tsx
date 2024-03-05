import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { roomStyle } from "../../styles/roomStyle";
import { colors } from "../../styles/colors";
import { useSelector } from 'react-redux';
import { selectUser } from "../../redux/reducers/userSlice";
import { RootStackParamList } from "../Main";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { globalStyle } from "../../styles/global";
import { MemoizedMessage } from "./Message";

export type MessageType = {
    content: string,
    date_created: Date,
    type: string,
    uid: string,
    user_name: string,
    message_id: string
}

type NavigationProps = NativeStackScreenProps<RootStackParamList, "Room">;

const Room = ({ route }: NavigationProps): React.JSX.Element => {
    const { room_id } = route.params;
    const [lastDocument, setLastDocument] = useState<object>();
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [messages, setMesages] = useState<MessageType[]>([]);
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
                date_last_message: firestore.FieldValue.serverTimestamp()
            })
        })
            .then(() => setChatMessage(""))
            .catch(err => console.error(err))
    }

    const fetchMoreMessages = () => {
        if (lastDocument != undefined) {
            setIsLoadingMessages(true);
            firestore()
                .collection("rooms")
                .doc(room_id)
                .collection("messages")
                .orderBy("date_created", "desc")
                .startAfter(lastDocument)
                .limit(10)
                .get()
                .then((snapshot) => {
                    setLastDocument(snapshot.docs[snapshot.docs.length - 1]);
                    const arr: MessageType[] = [];
                    snapshot.forEach(value => {
                        const data = value.data();
                        const message = {
                            ...data,
                            date_created: data.date_created.toDate(),
                            message_id: value.id
                        } as MessageType;
                        arr.push(message);
                    });
                    setMesages(prev => [...arr.reverse(), ...prev])
                })
                .catch(err => console.error(err))
                .finally(() => setIsLoadingMessages(false))
        }
    }

    useEffect(() => {
        const unsubscribe = firestore()
            .collection("rooms")
            .doc(room_id)
            .collection("messages")
            .orderBy("date_created", "desc")
            .limit(fetchLimit)
            .onSnapshot((snapshot) => {
                setLastDocument(snapshot.docs[snapshot.docs.length - 1]);
                const arr: MessageType[] = [];
                snapshot.docChanges().forEach(change => {
                    if (change.type === "added") {
                        const data = change.doc.data();
                        const message = {
                            ...data,
                            date_created: data.date_created.toDate(),
                            message_id: change.doc.id
                        } as MessageType;
                        arr.push(message);
                    }
                });
                setMesages(prev => [...prev, ...arr.reverse()]);
            }, (err) => console.log(err))

        return () => unsubscribe();
    }, [])

    const renderItem = useCallback(({ item }: { item: MessageType}) => (
        <MemoizedMessage item={item} user={user} />
    ), [])

    return (
        <>
            {isLoadingMessages && (
                <View style={[globalStyle.activityIndicator, { marginTop: 30 }]}>
                    <ActivityIndicator size={50} color="#0000ff" />
                </View>
            )}
            <FlatList
                contentContainerStyle={roomStyle.chatFlatList}
                overScrollMode="never"
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item: MessageType) => item.message_id}
                inverted
                onEndReachedThreshold={0.8}
                onEndReached={fetchMoreMessages}
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