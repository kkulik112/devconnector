import React, {Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import {Link, useParams} from 'react-router-dom'
import { getPost } from '../../actions/post'
import {connect} from 'react-redux'
import PostItem from '../posts/PostItem'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

const Post = ({getPost, post: {post, loading}}) => {
    const {id} = useParams()
    useEffect(() => {
        getPost(id)
    }, [getPost])

    return loading || post === null ? <Spinner/> : <Fragment>
            <Link to="/posts" className='btn'>Back To Posts</Link>
            <PostItem post={post} showActions={false}/>        
            <CommentForm postId={id} />
            {post.comments.map(comment => <CommentItem key={comment._id} comment={comment} postId={id}/>)}

        </Fragment>
}

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, {getPost})(Post)