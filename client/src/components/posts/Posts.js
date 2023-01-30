import React, {Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import { getPosts } from '../../actions/post'
import Spinner from '../layout/Spinner'
import {connect} from 'react-redux'

const Posts = ({getPosts, post: {posts, loading}}) => {

    useEffect(() => {
        getPosts()
    }, [getPosts])

  return (
    <div>
      
    </div>
  )
}

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, {getPosts})(Posts)
