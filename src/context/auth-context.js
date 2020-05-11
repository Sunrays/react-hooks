import React, {useState} from 'react';

export const AuthContext = React.createContext({
    login: () => {},
    isAuth: false
});

const AuthContextProvider = props => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const loginHandler = () => {
        setIsAuthenticated(true);
    };

    return (
    < AuthContext.Provider value = {{
            isAuth: isAuthenticated,
            login: loginHandler
        }} >
        {props.children}
    </AuthContext.Provider>
    )
}

export default AuthContextProvider;