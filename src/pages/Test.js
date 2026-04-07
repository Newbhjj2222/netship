import dynamic from "next/dynamic";

// Disable SSR (VERY IMPORTANT for 3D)
const Clock3D = dynamic(() => import("../components/Clock3D"), {
  ssr: false,
});

export default function ClockPage() {
  return <Clock3D />;
}
