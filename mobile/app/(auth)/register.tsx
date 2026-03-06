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
import { useAuthStore } from "../../lib/stores/auth";
import { theme } from "../../lib/theme";

const ROLES = [
  { value: "papa_aide", label: "Papa en recherche d'aide" },
  { value: "maman_demande", label: "Maman en demande" },
  { value: "papa_benevole", label: "Papa bénévole" },
] as const;

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [primaryRole, setPrimaryRole] = useState<string>("papa_aide");
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (password.length < 6) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
        primaryRole,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.error || "Erreur lors de l'inscription.";
      Alert.alert("Erreur", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez Papa pour la Vie</Text>
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Nom complet *</Text>
            <TextInput
              style={styles.input}
              placeholder="Jean Dupont"
              placeholderTextColor={theme.colors.gray[400]}
              value={fullName}
              onChangeText={setFullName}
              autoComplete="name"
            />
          </View>

          <View>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="votre@email.com"
              placeholderTextColor={theme.colors.gray[400]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              placeholder="06 12 34 56 78"
              placeholderTextColor={theme.colors.gray[400]}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
          </View>

          <View>
            <Text style={styles.label}>Mot de passe * (min. 6 caractères)</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre mot de passe"
              placeholderTextColor={theme.colors.gray[400]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View>
            <Text style={[styles.label, styles.labelWithMargin]}>
              Votre profil *
            </Text>
            <View style={styles.rolesGroup}>
              {ROLES.map((role) => (
                <TouchableOpacity
                  key={role.value}
                  style={[
                    styles.roleButton,
                    primaryRole === role.value
                      ? styles.roleButtonSelected
                      : styles.roleButtonDefault,
                  ]}
                  onPress={() => setPrimaryRole(role.value)}
                >
                  <Text
                    style={[
                      styles.roleText,
                      primaryRole === role.value
                        ? styles.roleTextSelected
                        : styles.roleTextDefault,
                    ]}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? "Création..." : "Créer mon compte"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginLink}>
          <Text style={styles.loginText}>Déjà un compte ? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.loginLinkText}>Se connecter</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1E40AF",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.gray[500],
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.gray[700],
    marginBottom: 4,
  },
  labelWithMargin: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: theme.colors.gray[50],
  },
  rolesGroup: {
    gap: 8,
  },
  roleButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  roleButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: "#EFF6FF",
  },
  roleButtonDefault: {
    borderColor: theme.colors.gray[400],
    backgroundColor: theme.colors.gray[50],
  },
  roleText: {
    fontSize: 16,
  },
  roleTextSelected: {
    color: "#1E40AF",
    fontWeight: "600",
  },
  roleTextDefault: {
    color: theme.colors.gray[700],
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.borderRadius,
    paddingVertical: 16,
    marginTop: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#93C5FD",
  },
  submitText: {
    color: theme.colors.white,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: theme.colors.gray[500],
  },
  loginLinkText: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
