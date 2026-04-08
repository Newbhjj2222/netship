import { db } from "../../components/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import styles from "../../styles/read.module.css";

// ================= HELPER =================
function parseHead(head) {
  const match = head?.match(/^(.*)\sS(\d+)\s?EP\s?(\d+)/i);
  if (!match) return null;

  return {
    title: match[1].trim(),
    season: parseInt(match[2]),
    episode: parseInt(match[3]),
  };
}

// ================= SSR =================
export async function getServerSideProps({ params, req }) {
  const { id } = params;

  const docRef = doc(db, "posts", id);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    return { notFound: true };
  }

  const post = { id, ...snap.data() };

  const parsed = parseHead(post.head);

  let seriesPosts = [];
  let currentIndex = 0;

  if (parsed) {
    const snapshot = await getDocs(collection(db, "posts"));

    seriesPosts = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p) => {
        const pParsed = parseHead(p.head);
        return pParsed && pParsed.title === parsed.title;
      })
      .map((p) => {
        const pParsed = parseHead(p.head);
        return { ...p, ...pParsed };
      })
      .sort((a, b) => {
        if (a.season === b.season) return a.episode - b.episode;
        return a.season - b.season;
      });

    currentIndex = seriesPosts.findIndex((p) => p.id === id);
  }

  // ===== COOKIE (progress) =====
  const cookies = req.headers.cookie || "";
  const match = cookies.match(/lastEpisode=([^;]+)/);

  if (match) {
    const savedId = match[1];
    if (savedId !== id) {
      return {
        redirect: {
          destination: `/post/${savedId}`,
          permanent: false,
        },
      };
    }
  }

  // ===== COMMENTS =====
  const commentsSnap = await getDocs(
    query(collection(db, "posts", id, "comments"), orderBy("createdAt", "desc"))
  );

  const comments = commentsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return {
    props: {
      post,
      seriesPosts,
      currentIndex,
      comments,
    },
  };
}

// ================= PAGE =================
export default function ReadPage({
  post,
  seriesPosts,
  currentIndex,
  comments,
}) {
  const next = seriesPosts[currentIndex + 1];
  const prev = seriesPosts[currentIndex - 1];

  // ===== SET COOKIE =====
  const saveProgress = () => {
    document.cookie = `lastEpisode=${post.id}; path=/`;
  };

  // ===== COPY =====
  const handleCopy = () => {
    navigator.clipboard.writeText(post.story || "");
    alert("Episode copied");
  };

  // ===== SHARE =====
  const link = `https://www.newtalentsg.co.rw/post/${post.id}`;
  const summary = post.story
    ?.replace(/<[^>]+>/g, "")
    .slice(0, 120);

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(summary + " " + link)}`
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${link}`
    );
  };

  // ===== COMMENT SUBMIT =====
  const handleComment = async (e) => {
    e.preventDefault();
    const text = e.target.comment.value;

    if (!text.trim()) return;

    await addDoc(collection(db, "posts", post.id, "comments"), {
      text,
      createdAt: new Date(),
    });

    location.reload();
  };

  return (
    <div className={styles.container}>
      <div className={styles.book} onLoad={saveProgress}>
        <h1 className={styles.title}>{post.head}</h1>

        <div
          className={styles.story}
          dangerouslySetInnerHTML={{ __html: post.story }}
        />

        {/* NAVIGATION */}
        <div className={styles.actions}>
          {prev && (
            <a href={`/post/${prev.id}`} className={styles.btn}>
              ← Prev
            </a>
          )}

          {next && (
            <a href={`/post/${next.id}`} className={styles.btn}>
              Next →
            </a>
          )}

          <button onClick={handleCopy} className={styles.btn}>
            Copy
          </button>

          <button onClick={shareWhatsApp} className={styles.btn}>
            WhatsApp
          </button>

          <button onClick={shareFacebook} className={styles.btn}>
            Facebook
          </button>
        </div>

        {/* COMMENTS */}
        <div className={styles.comments}>
          <h3>Comments</h3>

          <form onSubmit={handleComment} className={styles.commentBox}>
            <input name="comment" placeholder="Write comment..." />
            <button type="submit">Send</button>
          </form>

          {comments.map((c) => (
            <div key={c.id} className={styles.comment}>
              {c.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
