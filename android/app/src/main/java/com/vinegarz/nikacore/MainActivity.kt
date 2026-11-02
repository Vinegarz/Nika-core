package com.vinegarz.nikacore

import android.app.role.RoleManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) { NikaHome() }
            }
        }
    }
}

@Composable
private fun NikaHome() {
    var phone by remember { mutableStateOf("") }
    var result by remember { mutableStateOf<CallerMatch?>(null) }
    val context = LocalContext.current
    val roleLauncher = rememberLauncherForActivityResult(ActivityResultContracts.StartActivityForResult()) { }

    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("NIKA", style = MaterialTheme.typography.displaySmall)
        Text("Your calls, without the noise.", style = MaterialTheme.typography.bodyLarge)
        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("Search a number") },
            modifier = Modifier.fillMaxWidth()
        )
        Button(onClick = { result = LocalDirectory.lookup(phone) }) { Text("Look up") }
        Button(onClick = {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val roleManager = context.getSystemService(RoleManager::class.java)
                if (roleManager?.isRoleAvailable(RoleManager.ROLE_CALL_SCREENING) == true) {
                    roleLauncher.launch(roleManager.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING))
                }
            }
        }) { Text("Enable call screening") }

        result?.let { match ->
            Text(match.name, style = MaterialTheme.typography.headlineSmall)
            Text("Spam score: ${match.spamScore}/100")
            if (match.isTestData) Text("TEST DATA · local development record")
        }

        Text(
            "This prototype uses local test records. It does not claim access to Truecaller or CNAP databases.",
            style = MaterialTheme.typography.bodySmall
        )
    }
}
