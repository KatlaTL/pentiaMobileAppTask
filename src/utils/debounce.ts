export const debounce = <T extends (...agrs: any[]) => any>(func: T, wait: number = 250): (...args: Parameters<T>) => void => {
    let timeoutId;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, wait);
    }
}