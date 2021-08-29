import PostFeed from "../components/PostFeed";
import Loader from "../components/Loader";
import { firestore, fromMillis, postToJSON } from "../lib/firebase";
import Metatags from "../components/Metatags";
import { useState } from "react";

// Max post to query per page
const LIMIT = 1;

export async function getServerSideProps(context) {
    const postsQuery = firestore
        .collectionGroup("posts")
        .where("published", "==", true)
        .orderBy("createdAt", "desc")
        .limit(LIMIT);

    const posts = (await postsQuery.get()).docs.map(postToJSON);

    return {
        props: { posts }, // will be passed to the page component as props
    };
}

export default function Home(props) {
    const [posts, setPosts] = useState(props.posts);
    const [loading, setLoading] = useState(false);

    const [postsEnd, setPostsEnd] = useState(false);

    const getMorePosts = async () => {
        setLoading(true);
        const last = posts[posts.length - 1];

        const cursor =
            typeof last.createdAt === "number"
                ? fromMillis(last.createdAt)
                : last.createdAt;

        const query = firestore
            .collectionGroup("posts")
            .where("published", "==", true)
            .orderBy("createdAt", "desc")
            .startAfter(cursor)
            .limit(LIMIT);

        const newPosts = (await query.get()).docs.map((doc) => doc.data());

        setPosts(posts.concat(newPosts));
        setLoading(false);

        if (newPosts.length < limit) {
            setPostsEnd(true);
        }
    };

    return posts ? (
        <main>
            <Metatags
                title="Home Feed"
                description="this is the main home feed for content"
            />
            <h2>Nothing to show 😢</h2>
        </main>
    ) : (
        <main>
            <PostFeed posts={posts} />

            {!loading && !postsEnd && (
                <button onClick={getMorePosts}>Load more</button>
            )}

            <Loader show={loading} />

            {postsEnd && "You have reached the end!"}
        </main>
    );
}
