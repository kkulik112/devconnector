import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Route, Redirect, Navigate, useLocation} from 'react-router-dom'
import {connect} from 'react-redux'
import Spinner from '../layout/Spinner'


const PrivateRoute = ({
    component: Component,
    auth: { isAuthenticated, loading }
  }) => {
    if(loading) return <Spinner />
    if (isAuthenticated) return <Component />;
  
    return <Navigate to="/login" />;
  }

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(PrivateRoute)