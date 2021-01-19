const setLogin = (state = "" , action) => {
    switch (action.type){
        case "login":
            return action.token;
        case "logout":
            return "";
        default:
            return state
    }
}

export default setLogin;