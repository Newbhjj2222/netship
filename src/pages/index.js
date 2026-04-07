import Link from "next/link";
import { db } from "../components/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

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

      // Extract title, season, episode
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

    // Convert to array and compute stats
    const folders = Object.values(foldersMap).map((folder) => {
      // Sort episodes
      folder.posts.sort((a, b) => {
        if (a.season === b.season) {
          return a.episode - b.episode;
        }
        return a.season - b.season;
      });

      return {
        ...folder,
        totalSeasons: folder.seasons.size,
        totalEpisodes: folder.posts.length,
        image: folder.posts[0]?.imageUrl || "",
        firstEpisodeId: folder.posts[0]?.id || null,
      };
    });

    return {
      props: { folders },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { folders: [] },
    };
  }
}

export default function Posts({ folders }) {
  return (
    <div style={styles.container}>
      <h1>Stories Folders</h1>

      {folders.map((folder, i) => (
        <div key={i} style={styles.card}>
          {folder.image && (
            <img src={folder.image} style={styles.image} />
          )}

          <div style={styles.content}>
            <h2>{folder.title}</h2>

            <p>
              Seasons: {folder.totalSeasons} | Episodes:{" "}
              {folder.totalEpisodes}
            </p>

            <p>Author: {folder.author}</p>

            <div>
              {folder.categories.map((cat, idx) => (
                <span key={idx} style={styles.tag}>
                  {cat}
                </span>
              ))}
            </div>

            {folder.firstEpisodeId && (
              <Link href={`/post/${folder.firstEpisodeId}`}>
                <button style={styles.button}>
                  Read Stories
                </button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  card: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    overflow: "hidden",
  },
  image: {
    width: "200px",
    height: "150px",
    objectFit: "cover",
  },
  content: {
    padding: "10px",
  },
  tag: {
    marginRight: "5px",
    background: "#eee",
    padding: "3px 8px",
    borderRadius: "5px",
  },
  button: {
    marginTop: "10px",
    padding: "8px 15px",
    background: "#008489",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
