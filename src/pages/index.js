import Link from "next/link";
import { db } from "../components/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import styles from "../styles/posts.module.css";

// ================= SSR =================
export async function getServerSideProps() {
  try {
    const snapshot = await getDocs(
      query(collection(db, "posts"), orderBy("createdAt", "desc"))
    );

    const rawPosts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const foldersMap = {};

    rawPosts.forEach((post) => {
      const head = post.head || "";

      // Extract: TITLE + SEASON + EPISODE
      const match = head.match(/^(.*)\sS(\d+)\s?EP\s?(\d+)/i);

      if (!match) return;

      const title = match[1].trim();
      const season = parseInt(match[2]);
      const episode = parseInt(match[3]);

      if (!foldersMap[title]) {
        foldersMap[title] = {
          title,
          posts: [],
          seasons: new Set(),
          author: post.author || "Unknown",
          categories: post.categories || ["General"],
        };
      }

      foldersMap[title].posts.push({
        ...post,
        season,
        episode,
      });

      foldersMap[title].seasons.add(season);
    });

    // Convert to array + sorting + stats
    const folders = Object.values(foldersMap).map((folder) => {
      // Sort episodes
      folder.posts.sort((a, b) => {
        if (a.season === b.season) {
          return a.episode - b.episode;
        }
        return a.season - b.season;
      });

      return {
        title: folder.title,
        totalSeasons: folder.seasons.size,
        totalEpisodes: folder.posts.length,
        image: folder.posts[0]?.imageUrl || "",
        firstEpisodeId: folder.posts[0]?.id || null,
        author: folder.author,
        categories: folder.categories,
      };
    });

    return {
      props: { folders },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { folders: [] },
    };
  }
}

// ================= UI =================
export default function Posts({ folders }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Inkuru zose</h1>

      <div className={styles.grid}>
        {folders.map((folder, i) => (
          <div key={i} className={styles.card}>
            {folder.image && (
              <img
                src={folder.image}
                alt={folder.title}
                className={styles.image}
              />
            )}

            <div className={styles.content}>
              <div className={styles.title}>{folder.title}</div>

              <div className={styles.meta}>
                Seasons: {folder.totalSeasons} | Episodes:{" "}
                {folder.totalEpisodes}
              </div>

              <div className={styles.meta}>
                By {folder.author}
              </div>

              <div className={styles.tags}>
                {folder.categories.map((cat, idx) => (
                  <span key={idx} className={styles.tag}>
                    {cat}
                  </span>
                ))}
              </div>

              {folder.firstEpisodeId && (
                <Link href={`/post/${folder.firstEpisodeId}`}>
                  <button className={styles.button}>
                    Read Story
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {folders.length === 0 && (
        <p className={styles.empty}>No stories found.</p>
      )}
    </div>
  );
}
