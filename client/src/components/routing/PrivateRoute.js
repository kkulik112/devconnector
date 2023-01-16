import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Route, Redirect, Navigate, useLocation} from 'react-router-dom'
import {connect} from 'react-redux'


const PrivateRoute = ({
    component: Component,
    auth: { isAuthenticated, loading }
  }) => {
    if (isAuthenticated && !loading) return <Component />;
  
    return <Navigate to="/login" />;
  }

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(PrivateRoute)