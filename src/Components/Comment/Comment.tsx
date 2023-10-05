import React from 'react'
import Card from 'react-bootstrap/Card';

function Comment({ commentObject }) {
  return (
    <Card>
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p className='comment'>{commentObject.comment}</p>
          <footer className="blockquote-footer">
            {commentObject.user}, {commentObject.time}, {commentObject.date}
          </footer>
        </blockquote>
      </Card.Body>
    </Card>
  )
}

export default Comment