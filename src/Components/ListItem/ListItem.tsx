import React from 'react';
import { deleteDoc, doc } from 'firebase/firestore'; // Import the necessary Firebase functions
import { CloseButton, ListGroup } from 'react-bootstrap';
import './ListItem.css';
import { db } from '../../Config/firebaseConfig';

type ListItemProps = {
    item: string;
    docId: string; // Add a prop to pass the document ID
    collection: string; // Add a prop to pass the collection name
}

function ListItem({ item, docId, collection }: ListItemProps) {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleDelete = async () => {
        try {
            const docRef = doc(db, collection, docId); // Assuming 'machines' is the collection name
            await deleteDoc(docRef);
            console.log('Document deleted:', docId);
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    }

    return (
        <ListGroup.Item
            className="listitem"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {item}
            {isHovered && docId !== '' && (
                <CloseButton onClick={handleDelete} />
            )}
        </ListGroup.Item>
    );
}

export default ListItem;