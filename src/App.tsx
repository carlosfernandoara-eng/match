import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { GroupDrawPage } from "./pages/GroupDrawPage";
import { ColorDrawPage } from "./pages/ColorDrawPage";
import { ResultsPage } from "./pages/ResultsPage";

export type Screen = "home" | "groups" | "colors" | "results";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  if (screen === "groups") return <GroupDrawPage onNavigate={setScreen} />;
  if (screen === "colors") return <ColorDrawPage onNavigate={setScreen} />;
  if (screen === "results") return <ResultsPage onNavigate={setScreen} />;
  return <HomePage onNavigate={setScreen} />;
}
