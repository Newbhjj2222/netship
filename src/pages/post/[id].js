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
  where,
  setDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import cookie from "cookie";
import Link from "next/link";
import { FaWhatsapp, FaFacebook, FaCopy } from "react-icons/fa";
import styles from "../../styles/read.module.css";

// ===== PARSE HEAD =====
function parseHead(head) {
  const match = head?.match(/^(.*)\sS(\d+)\s?EP\s?(\d+)/i);
  if (!match) return null;
  return {
    title: match[1].trim(),
    season: parseInt(match[2]),
    episode: parseInt(match[3]),
  };
}

// ===== SSR =====
export async function getServerSideProps({ req, params }) {
  const { id } = params;

  const cookies = cookie.parse(req.headers.cookie || "");
  const userCookie = cookies.user ? JSON.parse(cookies.user) : null;

  if (!userCookie) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const username = userCookie.username;

  const q = query(collection(db, "members"), where("username", "==", username));
  const snapMembers = await getDocs(q);

  let isMember = false;
  let message = "";

  snapMembers.forEach((d) => {
    const data = d.data();
    const expires = data.subscriptionExpiresAt?.toDate?.() || new Date(0);
    if (data.isMember && expires > new Date()) {
      isMember = true;
    } else {
      message = "Membership yawe yararangiye cyangwa ntiwigeze uyihabwa twandikire Whatsapp tugufashe..";
    }
  });

  const postSnap = await getDoc(doc(db, "posts", id));
  if (!postSnap.exists()) return { notFound: true };
  const post = { id, ...postSnap.data() };
  const parsed = parseHead(post.head);

  let seriesPosts = [];
  let currentIndex = 0;

  if (parsed) {
    const allSnap = await getDocs(collection(db, "posts"));
    seriesPosts = allSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p) => {
        const pParsed = parseHead(p.head);
        return pParsed && pParsed.title === parsed.title;
      })
      .map((p) => ({ ...p, ...parseHead(p.head) }))
      .sort((a, b) =>
        a.season === b.season
          ? a.episode - b.episode
          : a.season - b.season
      );

    currentIndex = seriesPosts.findIndex((p) => p.id === id);
  }

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
      username,
      isMember,
      message,
    },
  };
}

// ===== COMPONENT =====
export default function ReadPage({
  post,
  seriesPosts,
  currentIndex,
  comments,
  username,
  isMember,
  message,
}) {
  const next = seriesPosts[currentIndex + 1];
  const prev = seriesPosts[currentIndex - 1];

  // ===== SAVE PROGRESS =====
  const saveProgress = async () => {
    try {
      const scrollPosition = window.scrollY;

      await setDoc(
        doc(db, "reading_progress", `${username}_${post.id}`),
        {
          username,
          postId: post.id,
          lastPosition: scrollPosition,
          updatedAt: serverTimestamp(),
        }
      );
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  };

  // ===== AUTO SAVE ON SCROLL =====
  useEffect(() => {
    const handleScroll = () => {
      saveProgress();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ===== AUTO RESUME =====
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const ref = doc(db, "reading_progress", `${username}_${post.id}`);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          window.scrollTo(0, data.lastPosition || 0);
        }
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    };

    loadProgress();
  }, []);

  // ===== ALERT =====
  if (!isMember && typeof window !== "undefined") {
    setTimeout(() => alert(message), 500);
  }

  // ===== COPY =====
  const handleCopy = async () => {
    try {
      const cookies = cookie.parse(document.cookie || "");
      const userCookie = cookies.user
        ? JSON.parse(cookies.user)
        : null;

      if (!userCookie) {
        alert("You must be logged in!");
        return;
      }

      const username = userCookie.username;

      const q = query(
        collection(db, "contracts"),
        where("fullName", "==", username)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("Nta content licensing ufite, ikwemerera gukoresha iyi nkuru ahandi. twandikire Whatsapp tugufashe.");
        return;
      }

      const hasApproved = snapshot.docs.some(
        (doc) => doc.data().approved === true
      );

      if (!hasApproved) {
        alert("Content licensing yawe ntabwo iremezwa, twandikire Whatsapp tugufashe.");
        return;
      }

      const text = post.story
        ?.replace(/<[^>]+>/g, "")
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p.length)
        .join("\n\n");

      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  const link = `https://www.newtalentsg.co.rw/post/${post.id}`;
  const summary = post.story?.replace(/<[^>]+>/g, "").slice(0, 820);

  const shareWhatsApp = () =>
    window.open(
      `https://wa.me/?text=${encodeURIComponent(summary + " " + link)}`
    );

  const shareFacebook = () =>
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${link}`
    );

  // ===== COMMENT =====
  const handleComment = async (e) => {
    e.preventDefault();
    if (!isMember) return;

    const text = e.target.comment.value.trim();
    if (!text) return;

    await addDoc(collection(db, "posts", post.id, "comments"), {
      text,
      author: username,
      createdAt: serverTimestamp(),
    });

    e.target.reset();
    location.reload();
  };

  return (
    <div className={styles.container}>
      <div className={styles.book}>
        <h1 className={styles.title}>{post.head}</h1>

        {post.image && (
          <img src={post.image} className={styles.image} />
        )}

        {isMember ? (
          <div
            className={styles.story}
            dangerouslySetInnerHTML={{ __html: post.story }}
          />
        ) : (
          <p className={styles.locked}>
            Ugomba kuba member kugirango usome iyi nkuru.
          </p>
        )}

        {isMember && (
          <div className={styles.actions}>
            {prev && <Link href={`/post/${prev.id}`}>← Prev</Link>}
            {next && <Link href={`/post/${next.id}`}>Next →</Link>}

            <button onClick={handleCopy}>
              <FaCopy /> Copy
            </button>

            <button onClick={shareWhatsApp}>
              <FaWhatsapp /> WhatsApp
            </button>

            <button onClick={shareFacebook}>
              <FaFacebook /> Facebook
            </button>
          </div>
        )}

        <div className={styles.comments}>
          <h3>Comments</h3>

          <form onSubmit={handleComment}>
            <input name="comment" placeholder="andika comment..." />
            <button type="submit">Send</button>
          </form>

          {comments.map((c) => (
            <div key={c.id}>
              <strong>{c.author || "Anonymous"}:</strong> {c.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
