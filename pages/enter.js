import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { UserContext } from "../lib/context";
import { useEffect, useState, useCallback, useContext } from "react";
import debounce from "lodash.debounce";
import Image from "next/image";
import Metatags from "@components/Metatags";

export default function EnterPage({}) {
    const { user, username } = useContext(UserContext);

    return (
        <main>
            <Metatags
                title="Welcome"
                description="Login page | login or signup"
            />

            {user ? (
                !username ? (
                    <UsernameForm />
                ) : (
                    <SignOutButton />
                )
            ) : (
                <SignInButton />
            )}
        </main>
    );
}

//sign in with google Button
function SignInButton() {
    const signInWithGoogle = async () => {
        await auth.signInWithPopup(googleAuthProvider);
    };
    return (
        <button className="btn-google" onClick={() => signInWithGoogle}>
            <div className="btn-img">
                <Image
                    src={"/google.png"}
                    alt="profile picture"
                    width="100"
                    height="100"
                    layout="responsive"
                />
            </div>
            Sign In with Google
        </button>
    );
}

//sign out Button
function SignOutButton() {
    return <button onclick={() => auth.signOut()}>Sign Out</button>;
}

//username form
function UsernameForm() {
    const [formValue, setFormValue] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();

        // Create refs for both documents
        const userDoc = firestore.doc(`users/${user.uid}`);
        const usernameDoc = firestore.doc(`usernames/${formValue}`);

        // Commit both docs together as a batch write.
        const batch = firestore.batch();
        batch.set(userDoc, {
            username: formValue,
            photoURL: user.photoURL,
            displayName: user.displayName,
        });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
    };

    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
        //validation
        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = firestore.doc(`usernames/${username}`);
                const { exists } = await ref.get();
                console.log("Firestore read executed!");
                setIsValid(!exists);
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input
                        name="username"
                        placeholder="myname"
                        value={formValue}
                        onChange={onChange}
                    />
                    <UsernameMessage
                        username={formValue}
                        isValid={isValid}
                        loading={loading}
                    />
                    <button
                        type="submit"
                        className="btn-green"
                        disabled={!isValid}
                    >
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>;
    } else {
        return <p></p>;
    }
}
