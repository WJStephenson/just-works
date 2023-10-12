import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Card, Form } from 'react-bootstrap';
import './Login.css';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../Config/firebaseConfig';

function Login({ signInWithGoogle, loading, error, setIsLoggedIn }) {

    const [
        signInWithEmailAndPassword,
        user,
        emailLoading,
        emailError,
    ] = useSignInWithEmailAndPassword(auth);

    if (error || emailError) return (<div>Error: {error}</div>);

    const emailLogin = async (e) => {
        e.preventDefault();
        console.log(e.target.email.value, e.target.password.value)
        const success = await signInWithEmailAndPassword(e.target.email.value, e.target.password.value);
        if (success) {
            console.log('Signed in')
            setIsLoggedIn(true);
        }
    }

    return (
        <div className='login-container'>
            <h1>Just Works</h1>
            {
                loading || emailLoading ?
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    :
                    <>
                        <Form onSubmit={emailLogin}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" name="email" placeholder="Enter email" required />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" placeholder="Password" required />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                        <br />
                        <h3>or</h3>
                        <br />
                        <Card.Body>
                            <Button variant="primary" onClick={signInWithGoogle}>Sign in with Google</Button>
                        </Card.Body>
                    </>
            }

        </div>
    );
}

export default Login