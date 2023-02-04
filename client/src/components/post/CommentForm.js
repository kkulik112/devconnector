import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { addComment } from '../../actions/post'
import {connect} from 'react-redux'

const CommentForm = ({postId, addComment}) => {

    const [text, setText] = useState('')

    const onSubmit = e => {
        e.preventDefault()
        addComment(postId, {text})
        setText('')
    }

    return (
        <div className="post-form">
            <div className="bg-primary p">
                <h3>Leave a comment</h3>
            </div>
            <form className="form my-1" onSubmit={e => onSubmit(e)}>
                <textarea name="text" cols="30" rows="5" placehorder="Create a comment" value={text} onChange={e => setText(e.target.value)} required>
                </textarea>
                <input type="submit" className="btn btn-dark my-1" value="Submit"/>
            </form>
        </div>
    )
}

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired
}

export default connect(null, {addComment})(CommentForm)