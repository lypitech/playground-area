// app/index.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const passwordRef = useRef<TextInput>(null);

  const errors = useMemo(() => {
    const e: Partial<Record<"email" | "password", string>> = {};
    if (touched.email && !EMAIL_REGEX.test(email)) e.email = "Email invalide";
    if (touched.password && password.length < 6)
      e.password = "6 caractères minimum";
    return e;
  }, [email, password, touched]);

  const canSubmit = EMAIL_REGEX.test(email) && password.length >= 6 && !loading;

  const submit = async () => {
    if (!canSubmit) {
      setTouched({ email: true, password: true });
      return;
    }
    try {
      setLoading(true);
      await fakeLoginApi(email, password);
      Alert.alert("Connexion réussie", "Bienvenue !");
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert(
        "Échec de la connexion",
        err?.message ?? "Vérifie tes identifiants"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding" })}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.subtitle}>Ravi de te revoir</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="exemple@email.com"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              style={[styles.input, errors.email && styles.inputError]}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            <Text style={[styles.label, { marginTop: 16 }]}>Mot de passe</Text>
            <View
              style={[
                styles.input,
                styles.passwordRow,
                errors.password && styles.inputError,
              ]}
            >
              <TextInput
                ref={passwordRef}
                value={password}
                onChangeText={setPassword}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                placeholder="••••••••"
                placeholderTextColor="#888"
                secureTextEntry={secure}
                autoCapitalize="none"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={submit}
                style={styles.passwordInput}
              />
              <TouchableOpacity onPress={() => setSecure((s) => !s)}>
                <Text style={styles.toggle}>{secure ? "👁️" : "🚫"}</Text>
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <TouchableOpacity
              onPress={submit}
              disabled={!canSubmit}
              style={[styles.button, !canSubmit && styles.buttonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="black" />
              ) : (
                <Text style={styles.buttonText}>Se connecter</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

async function fakeLoginApi(email: string, password: string) {
  await new Promise((r) => setTimeout(r, 700));
  if (email === "demo@exemple.com" && password === "secret123") return true;
  throw new Error("Email ou mot de passe incorrect");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: "black",
  },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "700", color: "white" },
  subtitle: { fontSize: 16, color: "#ccc", marginTop: 4 },
  form: { marginTop: 20 },
  label: { fontSize: 14, color: "white", marginBottom: 6 },
  input: {
    backgroundColor: "#111",
    color: "white",
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 14, android: 10 }),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  inputError: { borderColor: "red" },
  errorText: { color: "red", marginTop: 6, fontSize: 12 },
  passwordRow: { flexDirection: "row", alignItems: "center", paddingRight: 10 },
  passwordInput: { flex: 1, color: "white", paddingVertical: 0 },
  toggle: { color: "white", marginLeft: 8 },
  button: {
    marginTop: 24,
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "black", fontWeight: "700", fontSize: 16 },
});
