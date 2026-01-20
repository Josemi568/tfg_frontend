import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from '../utils/storage';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated = !!getToken();

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;