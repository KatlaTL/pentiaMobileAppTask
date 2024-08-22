import React from "react"
import { Text, View } from "react-native"

type chatBubbleType = {
    bubbleStyle: object[],
    textStyle: object[],
    text: string
}

/**
 * Renders a Chat Bubble 
 */
export const ChatBubble = ({ bubbleStyle, textStyle, text }: chatBubbleType): React.JSX.Element => {
    return (
        <View style={bubbleStyle}>
            <Text style={textStyle}>{text}</Text>
        </View>
    )
}