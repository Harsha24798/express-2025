export const loginError = (error=[]) => {
    const errorMsg = {}

    for(const e of error) {
        if(errorMsg[e.path] !== undefined) {
            const msg = `${errorMsg[e.path]}, ${e.msg}`
            errorMsg[e.path] = msg
        } else {
            errorMsg[e.path] = e.msg
        }
    }
    return errorMsg
}