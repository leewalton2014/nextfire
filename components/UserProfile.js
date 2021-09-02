import Image from "next/image";

// UI component for user profile
export default function UserProfile({ user }) {
    return (
        <div className="box-center">
            <div className="profile-img-center">
                <Image
                    src={user?.photoURL || "/hacker.png"}
                    alt="profile picture"
                    width="100"
                    height="100"
                    layout="responsive"
                />
            </div>

            <p>
                <i>@{user.username}</i>
            </p>
            <h1>{user.displayName || "Anonymous User"}</h1>
        </div>
    );
}
