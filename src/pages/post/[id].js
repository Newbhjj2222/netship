// pages/post/[id].js
import { db } from "../../components/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import cookie from "cookie";
import Link from "next/link";
import { FaWhatsapp, FaFacebook, FaCopy } from "react-icons/fa";
import styles from "../../styles/read.module.css";

function parseHead(head) {
  const match = head?.match(/^(.*)\sS(\d+)\s?EP\s?(\d+)/i);
  if (!match) return null;
  return {
    title: match[1].trim(),
    season: parseInt(match[2]),
    episode: parseInt(match[3]),
  };
}

export async function getServerSideProps({ req, params }) {
  const { id } = params;

  // ===== READ USER COOKIE =====
  const cookies = cookie.parse(req.headers.cookie || "");
  const userCookie = cookies.user ? JSON.parse(cookies.user) : null;

  if (!userCookie) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  const uid = userCookie.uid;
  const username = userCookie.username || null;

  // ===== CHECK MEMBERSHIP =====
  const memberSnap = await getDoc(doc(db, "members", uid));
  if (!memberSnap.exists()) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const memberData = memberSnap.data();
  if (!memberData.isMember || memberData.subscriptionExpiresAt?.toDate() < new Date()) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // ===== GET POST =====
  const snap = await getDoc(doc(db, "posts", id));
  if (!snap.exists()) return { notFound: true };
  const post = { id, ...snap.data() };
  const parsed = parseHead(post.head);

  // ===== GET SERIES POSTS =====
  let seriesPosts = [];
  let currentIndex = 0;
  if (parsed) {
    const all = await getDocs(collection(db, "posts"));
    seriesPosts = all.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p) => {
        const pParsed = parseHead(p.head);
        return pParsed && pParsed.title === parsed.title;
      })
      .map((p) => ({ ...p, ...parseHead(p.head) }))
      .sort((a, b) => {
        if (a.season === b.season) return a.episode - b.episode;
        return a.season - b.season;
      });

    currentIndex = seriesPosts.findIndex((p) => p.id === id);
  }

  // ===== GET COMMENTS =====
  const commentsSnap = await getDocs(
    query(collection(db, "posts", id, "comments"), orderBy("createdAt", "desc"))
  );
  const comments = commentsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return {
    props: { post, seriesPosts, currentIndex, comments, username },
  };
}

export default function ReadPage({ post, seriesPosts, currentIndex, comments, username }) {
  const next = seriesPosts[currentIndex + 1];
  const prev = seriesPosts[currentIndex - 1];

  // ===== COPY STORY TEXT =====
  const handleCopy = () => {
    const text = post.story
      ?.replace(/<[^>]+>/g, "")
      .split("\n")
      .map(p => p.trim())
      .filter(p => p.length)
      .join("\n\n") || "";
    navigator.clipboard.writeText(text);
    alert("Episode copied!");
  };

  const link = `https://www.newtalentsg.co.rw/post/${post.id}`;
  const summary = post.story?.replace(/<[^>]+>/g, "").slice(0, 120);

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(summary + " " + link)}`);
  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${link}`);

  const handleComment = async (e) => {
    e.preventDefault();
    const text = e.target.comment.value.trim();
    if (!text) return;

    await addDoc(collection(db, "posts", post.id, "comments"), {
      text,
      author: username,
      createdAt: serverTimestamp(),
    });

    e.target.reset();
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <div className={styles.book}>
        <h1 className={styles.title}>{post.head}</h1>

        {/* 📸 Episode Image */}
        {post.image && <img src={post.image} alt="Episode Image" className={styles.episodeImage} />}

        {/* Story content */}
        <div className={styles.story} dangerouslySetInnerHTML={{ __html: post.story }} />

        {/* ACTIONS */}
        <div className={styles.actions}>
          {prev && <Link href={`/post/${prev.id}`} className={styles.btn}>← Prev</Link>}
          {next && <Link href={`/post/${next.id}`} className={styles.btn}>Next →</Link>}
          <button onClick={handleCopy} className={styles.iconBtn}><FaCopy /> Copy</button>
          <button onClick={shareWhatsApp} className={styles.iconBtn}><FaWhatsapp /> WhatsApp</button>
          <button onClick={shareFacebook} className={styles.iconBtn}><FaFacebook /> Facebook</button>
        </div>

        {/* COMMENTS */}
        <div className={styles.commentsSection}>
          <h3>Comments</h3>
          <form onSubmit={handleComment} className={styles.commentBox}>
            <input name="comment" placeholder="Write comment..." />
            <button type="submit">Send</button>
          </form>
          <div className={styles.commentList}>
            {comments.map((c) => (
              <div key={c.id} className={styles.commentItem}>
                <strong>{c.author || "Anonymous"}:</strong> {c.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
