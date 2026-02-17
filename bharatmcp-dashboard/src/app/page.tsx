import { redirect } from "next/navigation";

export default function Home() {
  redirect("/agents/agent_demo/identity");
}
