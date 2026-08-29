export interface KitColor {
  id: string;
  name: string;
  hex: string;
  hexLight: string;
}

// Cores extraídas dos mockups oficiais das camisas da Copa PMVR Intercolegial.
export const KIT_COLORS: KitColor[] = [
  { id: "c01", name: "Roxo", hex: "#4F49C7", hexLight: "#8B86DD" },
  { id: "c02", name: "Verde-Água", hex: "#1FE3C4", hexLight: "#7EF5E1" },
  { id: "c03", name: "Rosa", hex: "#FF7DA6", hexLight: "#FFB3CB" },
  { id: "c04", name: "Vermelho", hex: "#D31E2A", hexLight: "#E8636A" },
  { id: "c05", name: "Azul Royal", hex: "#0A5FDC", hexLight: "#5C93E8" },
  { id: "c06", name: "Verde", hex: "#2F8A2F", hexLight: "#79B678" },
  { id: "c07", name: "Laranja", hex: "#FC7F1A", hexLight: "#FDB275" },
  { id: "c08", name: "Amarelo-Ouro", hex: "#FFCE00", hexLight: "#FFE166" },
  { id: "c09", name: "Marinho", hex: "#242A44", hexLight: "#525878" },
  { id: "c10", name: "Lilás", hex: "#A658DD", hexLight: "#C79BEC" },
  { id: "c11", name: "Branco/Gelo", hex: "#E2E2E2", hexLight: "#EDEDED" },
  { id: "c12", name: "Bege/Champanhe", hex: "#D4BA8A", hexLight: "#E5D5B8" },
];

export const KIT_COLOR_BY_ID: Record<string, KitColor> = Object.fromEntries(
  KIT_COLORS.map((c) => [c.id, c]),
);
