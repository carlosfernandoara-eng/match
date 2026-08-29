import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TEAMS, TEAM_BY_ID, type Team } from "./data/teams";
import { KIT_COLORS, KIT_COLOR_BY_ID, type KitColor } from "./data/colors";
import { secureRandomInt } from "./lib/random";

export type GroupKey = "A" | "B" | "C" | "D";
export const GROUP_KEYS: GroupKey[] = ["A", "B", "C", "D"];

type Groups = Record<GroupKey, string[]>;

const emptyGroups = (): Groups => ({ A: [], B: [], C: [], D: [] });

interface DrawStore {
  groupRemaining: string[];
  groupOrder: string[];
  groups: Groups;
  colorRemaining: string[];
  colorOrder: string[];
  colorAssignment: Record<string, string>;

  drawNextGroupTeam: () => { team: Team; group: GroupKey } | null;
  resetGroups: () => void;

  drawNextColor: () => { team: Team; color: KitColor } | null;
  resetColors: () => void;

  resetAll: () => void;
}

export const useDrawStore = create<DrawStore>()(
  persist(
    (set, get) => ({
      groupRemaining: TEAMS.map((t) => t.id),
      groupOrder: [],
      groups: emptyGroups(),
      colorRemaining: KIT_COLORS.map((c) => c.id),
      colorOrder: [],
      colorAssignment: {},

      drawNextGroupTeam: () => {
        const s = get();
        if (s.groupRemaining.length === 0) return null;

        const idx = secureRandomInt(s.groupRemaining.length);
        const teamId = s.groupRemaining[idx];
        const slot = s.groupOrder.length;
        const groupKey = GROUP_KEYS[slot % 4];

        set({
          groupRemaining: s.groupRemaining.filter((_, i) => i !== idx),
          groupOrder: [...s.groupOrder, teamId],
          groups: {
            ...s.groups,
            [groupKey]: [...s.groups[groupKey], teamId],
          },
        });

        return { team: TEAM_BY_ID[teamId], group: groupKey };
      },

      resetGroups: () =>
        set({
          groupRemaining: TEAMS.map((t) => t.id),
          groupOrder: [],
          groups: emptyGroups(),
        }),

      drawNextColor: () => {
        const s = get();
        const groupsComplete = s.groupOrder.length === TEAMS.length;
        if (!groupsComplete) return null;

        const teamOrder = GROUP_KEYS.flatMap((g) => s.groups[g]);
        const nextTeamId = teamOrder.find((id) => !s.colorAssignment[id]);
        if (!nextTeamId || s.colorRemaining.length === 0) return null;

        const idx = secureRandomInt(s.colorRemaining.length);
        const colorId = s.colorRemaining[idx];

        set({
          colorRemaining: s.colorRemaining.filter((_, i) => i !== idx),
          colorOrder: [...s.colorOrder, colorId],
          colorAssignment: { ...s.colorAssignment, [nextTeamId]: colorId },
        });

        return { team: TEAM_BY_ID[nextTeamId], color: KIT_COLOR_BY_ID[colorId] };
      },

      resetColors: () =>
        set({
          colorRemaining: KIT_COLORS.map((c) => c.id),
          colorOrder: [],
          colorAssignment: {},
        }),

      resetAll: () =>
        set({
          groupRemaining: TEAMS.map((t) => t.id),
          groupOrder: [],
          groups: emptyGroups(),
          colorRemaining: KIT_COLORS.map((c) => c.id),
          colorOrder: [],
          colorAssignment: {},
        }),
    }),
    { name: "copa-pmvr-sorteio" },
  ),
);
