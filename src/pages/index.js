import dynamic from "next/dynamic";

const FootballScene = dynamic(
  () => import("../components/FootballScene"),
  { ssr: false }
);

export default function Home() {
  return <FootballScene />;
}
