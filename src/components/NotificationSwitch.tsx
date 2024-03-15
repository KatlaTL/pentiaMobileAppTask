import React, { useState } from "react"
import { Switch, Text, View } from "react-native"

type NotificationsSwitchType = {
    color: string,
    notifications: boolean,
    onToggleSwitch: () => void
}

const NotificationsSwitch = (props: NotificationsSwitchType): React.JSX.Element => {

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: props.color }}>{"Notifications"}</Text>
            <Switch trackColor={{ true: props.color, false: props.color }} value={props.notifications} onValueChange={props.onToggleSwitch} />
        </View>
    )
}

export default NotificationsSwitch;