import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { API_URL } from "../../lib/config";
import { useAuthStore } from "../../lib/stores/auth";

const INPUT_PLACEHOLDER = "#94a3b8";
const BORDER_COLOR = "#e2e8f0";
const INPUT_BG = "#f8fafc";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err: any) {
      const isNetworkError =
        !err?.response &&
        (err?.code === "ECONNREFUSED" ||
          err?.message?.includes("Network Error") ||
          err?.message?.includes("network"));
      const message = isNetworkError
        ? `Impossible de joindre le serveur (${API_URL}). Démarrez l’API avec « npm run dev » à la racine du projet, puis réessayez. Sur appareil réel, mettez l’IP de votre machine dans .env.local (EXPO_PUBLIC_API_URL).`
        : err?.response?.data?.error || "Erreur de connexion. Réessayez.";
      Alert.alert("Erreur", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "#f1f5f9" }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top + 24, 32),
              paddingBottom: insets.bottom + 24,
              paddingLeft: 24 + insets.left,
              paddingRight: 24 + insets.right,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Papa pour la Vie</Text>
            <Text style={styles.subtitle}>
              Connectez-vous à votre compte
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="votre@email.com"
                placeholderTextColor={INPUT_PLACEHOLDER}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="Votre mot de passe"
                placeholderTextColor={INPUT_PLACEHOLDER}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>
                {loading ? "Connexion..." : "Se connecter"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.link}>S'inscrire</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e40af",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: INPUT_BG,
    color: "#0f172a",
  },
  button: {
    backgroundColor: "#1d4ed8",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
    flexWrap: "wrap",
    gap: 4,
  },
  footerText: {
    fontSize: 15,
    color: "#64748b",
  },
  link: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1d4ed8",
  },
});
