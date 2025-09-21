package fr.lypitech.nativee

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import fr.lypitech.nativee.ui.theme.NativeTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NativeTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    LoginScreen(
                        onSuccess = {
                            Toast.makeText(this, "Connexion réussie", Toast.LENGTH_SHORT).show()
                        }
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    onSuccess: () -> Unit,
) {
    val focus = LocalFocusManager.current

    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(false) }

    val emailValid = remember(email) { EMAIL_REGEX.matches(email.trim()) }
    val passwordValid = remember(password) { password.length >= 6 }
    val formValid = emailValid && passwordValid && !loading

    fun submit() {
        focus.clearFocus()
        error = null
        loading = true

        val ok = email.trim().equals("demo@local.dev", ignoreCase = true) &&
                 password == "secret123"

        loading = false
        if (ok) onSuccess() else error = "Identifiants invalides"
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = "Connexion", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(24.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            singleLine = true,
            isError = email.isNotEmpty() && !emailValid,
            supportingText = {
                if (email.isNotEmpty() && !emailValid)
                    Text("Format d’email invalide")
            },
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Email,
                imeAction = ImeAction.Next
            ),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(Modifier.height(12.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Mot de passe") },
            singleLine = true,
            isError = password.isNotEmpty() && !passwordValid,
            supportingText = {
                if (password.isNotEmpty() && !passwordValid)
                    Text("Au moins 6 caractères")
            },
            visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
            trailingIcon = {
                TextButton(onClick = { passwordVisible = !passwordVisible }) {
                    Text(if (passwordVisible) "Masquer" else "Afficher")
                }
            },
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Password,
                imeAction = ImeAction.Done
            ),
            keyboardActions = KeyboardActions(
                onDone = { if (formValid) submit() else focus.clearFocus() }
            ),
            modifier = Modifier.fillMaxWidth()
        )

        if (error != null) {
            Spacer(Modifier.height(12.dp))
            Text(text = error!!, color = MaterialTheme.colorScheme.error)
        }

        Spacer(Modifier.height(24.dp))

        Button(
            onClick = { submit() },
            enabled = formValid,
            modifier = Modifier.fillMaxWidth(),
        ) {
            if (loading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(18.dp),
                    strokeWidth = 2.dp
                )
                Spacer(Modifier.width(8.dp))
                Text("Connexion…")
            } else {
                Text("Se connecter")
            }
        }

        Spacer(Modifier.height(12.dp))
    }
}

private val EMAIL_REGEX =
    Regex("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\$", RegexOption.IGNORE_CASE)
