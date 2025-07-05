export const Throttle = (func: (...args: any[]) => void, delay: number) => {
    let isFetching = false
    return function (...args: any[]) {
        if (!isFetching) {            
            func(...args)
            isFetching = true
            setTimeout(() => { isFetching = false }, delay)
        }
    }
}