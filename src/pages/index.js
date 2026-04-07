import dynamic from "next/dynamic";

const Welcome3D = dynamic(
  () => import("../components/Welcome3D"),
  { ssr: false }
);

export default function Home() {
  return <Welcome3D />;
}
