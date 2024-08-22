import { MessageType } from "../redux/reducers/messageSlice";

/**
 * Debounce wrapper functions.
 * Used to prevent multiple function calls in quick succesion of for example an API call
 * @param func - Function to be wrapped
 * @param wait - Time to wait before allowing the next function call in milliseconds
 * @returns 
 */
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
    title: string,
    data: MessageType[]
}

/**
 * Group list of messages by date and time. Like Facebook messenger 
 * TO-DO - use this method to change message flatlist to sectionlist
 */
export const groupByDate = (messageArray: MessageType[]): MessageTypeGrouppedByDate[] => {
    return messageArray.reduce((accumulator, currentValue: MessageType) => {
        //const lastKey: string = Object.keys(accumulator)[Object.keys(accumulator).length - 1];
        const lastDate: string = accumulator[accumulator.length - 1].title;
        const accDate: Date = new Date(lastDate);
        const currentDate: Date = new Date(currentValue.date_created);

        if (isSameDate(accDate, currentDate)) {
            const tempArr: MessageType[] = accumulator[accumulator.length - 1].data;
            tempArr.push(currentValue);

            const returnArr = [...accumulator];
            returnArr[accumulator.length - 1].data = [...tempArr];

            return returnArr;
        } else {
            return [...accumulator, { title: currentValue.date_created, data: [currentValue] }];
        }
    }, [{ title: messageArray[0].date_created, data: new Array<MessageType>() }]);
}

/**
 *  Check if two dates are the same 
 */
export const isSameDate = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
}