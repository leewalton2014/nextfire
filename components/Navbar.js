import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import Image from "next/image";

//top navbar
export default function NavBar() {
    const { user, username } = useContext(UserContext);

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/" passHref>
                        <button className="btn-logo">Feed</button>
                    </Link>
                </li>
                {/*User is signed in */}
                {username && (
                    <>
                        <li className="push-left">
                            <Link href="/admin" passHref>
                                <button className="btn-blue">
                                    Write Posts
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`} passHref>
                                <Image
                                    src={user?.photoURL}
                                    alt="profile picture"
                                    height="100%"
                                    width="100%"
                                />
                            </Link>
                        </li>
                    </>
                )}
                {/*User is not signed in */}
                {!username && (
                    <>
                        <li>
                            <Link href="/enter" passHref>
                                <button className="btn-blue">Login</button>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}
