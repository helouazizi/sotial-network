export const Debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>
    return function (...args: any[]) {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func(...args)
        }, delay)

    }
}

