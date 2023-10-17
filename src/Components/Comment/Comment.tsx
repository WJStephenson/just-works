import Card from 'react-bootstrap/Card';
import { formatISODate } from './../../Utility/Functions';

type CommentProps = {
  commentObject: {
    comment: string;
    user: string;
    datetime: string;
  }
}

function Comment({ commentObject }: CommentProps) {
  return (
    <Card>
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p className='comment'>{commentObject.comment}</p>
          <footer className="blockquote-footer">
            {commentObject.user !== '' ? '' : `${commentObject.user},`} {formatISODate(commentObject.datetime)}
          </footer>
        </blockquote>
      </Card.Body>
    </Card>
  )
}

export default Comment