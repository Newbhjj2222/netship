import Link from "next/link";
import styles from "./styles/posts.module.css";

export default function Posts({ folders }) {
  return (
    <div className={styles.container}>
      <h1>Stories</h1>

      <div className={styles.grid}>
        {folders.map((folder, i) => (
          <div key={i} className={styles.card}>
            {folder.image && (
              <img src={folder.image} className={styles.image} />
            )}

            <div className={styles.content}>
              <div className={styles.title}>{folder.title}</div>

              <div className={styles.meta}>
                Seasons: {folder.totalSeasons} | Episodes: {folder.totalEpisodes}
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
                    Read Stories
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
