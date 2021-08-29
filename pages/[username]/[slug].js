import styles from "../../styles/Post.module.css";
import PostContent from "../../components/PostContent";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";

export default function PostPage({}) {
    return (
        <main>
            <h1>Post</h1>
        </main>
    );
}
