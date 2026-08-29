import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { GroupDrawPage } from "./pages/GroupDrawPage";
import { ColorDrawPage } from "./pages/ColorDrawPage";
import { ResultsPage } from "./pages/ResultsPage";
import { FullscreenButton } from "./components/FullscreenButton";

export type Screen = "home" | "groups" | "colors" | "results";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <>
      {screen === "groups" && <GroupDrawPage onNavigate={setScreen} />}
      {screen === "colors" && <ColorDrawPage onNavigate={setScreen} />}
      {screen === "results" && <ResultsPage onNavigate={setScreen} />}
      {screen === "home" && <HomePage onNavigate={setScreen} />}
      <FullscreenButton />
    </>
  );
}
