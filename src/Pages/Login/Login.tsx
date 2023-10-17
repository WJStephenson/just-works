import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Card, Form } from 'react-bootstrap';
import './Login.css';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../../Config/firebaseConfig';
import { UserCredential } from 'firebase/auth';

function Login({ setIsLoggedIn }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }) {
    document.title = 'Just Works | Login';

    const [signInWithEmailAndPassword, emailLoading] = useSignInWithEmailAndPassword(auth);
    const [signInWithGoogle, loading] = useSignInWithGoogle(auth);

    const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const userCredential: UserCredential | undefined = await signInWithEmailAndPassword(email, password);
            if (userCredential?.user) {
                const user = userCredential.user;
                console.log('Signed in as:', user.email);
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error('Email sign-in error:', error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const userCredential: UserCredential | undefined = await signInWithGoogle();
            if (userCredential?.user) {
                const user = userCredential.user;
                console.log('Signed in as:', user.displayName || user.email);
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
        }
    }

    return (
        <div className='login-container'>
            <h1>Just Works</h1>
            {loading || emailLoading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <>
                    <Form onSubmit={handleEmailLogin}>
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
                        <Button variant="primary" onClick={handleGoogleSignIn}>Sign in with Google</Button>
                    </Card.Body>
                </>
            )}
        </div>
    );
}

export default Login;
