import { redirect } from "next/navigation";

export default function AgentsPage() {
  // For now, redirect to the demo agent
  redirect("/agents/agent_demo/identity");
}
