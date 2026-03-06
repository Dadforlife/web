import { StyleSheet } from "react-native";

export const theme = {
  colors: {
    primary: "#2F5BFF",
    surface: "#F5F6FA",
    white: "#FFFFFF",
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      900: "#111827",
    },
  },
  spacing: {
    cardPadding: 20,
    borderRadius: 14,
    borderRadiusLg: 16,
  },
  shadow: {
    card: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    button: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.borderRadius,
    padding: theme.spacing.cardPadding,
    borderWidth: 1,
    borderColor: theme.colors.gray[100],
    ...theme.shadow.card,
  },
  cardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "47%",
    minWidth: "47%",
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.borderRadius,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
