import { MessageType } from "../redux/reducers/messageSlice";

export const debounce = <T extends (...agrs: any[]) => any>(func: T, wait: number = 250): (...args: Parameters<T>) => void => {
    let timeoutId;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, wait);
    }
}

export type MessageTypeGrouppedByDate = {
    [key: string]: MessageType[]
}

// TO-DO - replace current messages rendering with this
export const groupByDate = (messageArray: MessageType[]): MessageTypeGrouppedByDate => {
    return messageArray.reduce((accumulator, currentValue: MessageType) => {
        const lastKey: string = Object.keys(accumulator)[Object.keys(accumulator).length - 1];
        const accDate: Date = new Date(lastKey);
        const currentDate: Date = new Date(currentValue.date_created);

        if (isToday(accDate, currentDate)) {
            const tempArr: MessageType[] = accumulator[lastKey];
            tempArr.push(currentValue)
            return { ...accumulator, [lastKey]: [...tempArr] };
        } else {
            return { ...accumulator, [currentValue.date_created]: [currentValue] }
        }
    }, { [messageArray[0].date_created]: [messageArray[0]] })
}

export const isToday = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
}