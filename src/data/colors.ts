export interface KitColor {
  id: string;
  name: string;
  hex: string;
  hexLight: string;
}

// Cores extraídas dos mockups oficiais das camisas da Copa PMVR Intercolegial.
export const KIT_COLORS: KitColor[] = [
  { id: "c01", name: "Amarelo Neon", hex: "#D7EF2A", hexLight: "#EDF789" },
  { id: "c02", name: "Roxo", hex: "#4F49C7", hexLight: "#8B86DD" },
  { id: "c03", name: "Verde-Água", hex: "#1FE3C4", hexLight: "#7EF5E1" },
  { id: "c04", name: "Rosa", hex: "#FF7DA6", hexLight: "#FFB3CB" },
  { id: "c05", name: "Vermelho", hex: "#D31E2A", hexLight: "#E8636A" },
  { id: "c06", name: "Azul Royal", hex: "#0A5FDC", hexLight: "#5C93E8" },
  { id: "c07", name: "Verde", hex: "#2F8A2F", hexLight: "#79B678" },
  { id: "c08", name: "Laranja", hex: "#FC7F1A", hexLight: "#FDB275" },
  { id: "c09", name: "Azul Serena", hex: "#4BA9D6", hexLight: "#93D0EA" },
  { id: "c10", name: "Amarelo-Ouro", hex: "#FFCE00", hexLight: "#FFE166" },
  { id: "c11", name: "Marinho", hex: "#242A44", hexLight: "#525878" },
  { id: "c12", name: "Lilás", hex: "#A658DD", hexLight: "#C79BEC" },
];

export const KIT_COLOR_BY_ID: Record<string, KitColor> = Object.fromEntries(
  KIT_COLORS.map((c) => [c.id, c]),
);
