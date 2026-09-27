package com.pulse.fitness;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.OutputStream;

/**
 * Shell natif de Pulse : un WebView plein écran qui charge l'app web
 * embarquée dans les assets (dossier ../web partagé avec la version
 * navigateur). JS + DOM storage activés pour le suivi localStorage.
 * FileChooser + DownloadListener pour l'import/export JSON des
 * programmes personnalisés.
 */
public class MainActivity extends Activity {

    private static final int BG = Color.parseColor("#0b0d10");
    private static final int FILE_REQUEST = 42;

    private WebView webView;
    private ValueCallback<Uri[]> fileCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setStatusBarColor(BG);
        getWindow().setNavigationBarColor(Color.parseColor("#0f1217"));

        webView = new WebView(this);
        webView.setBackgroundColor(BG);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        // Nécessaire : targetSdk 35 désactive par défaut l'accès file://
        // dont dépendent les sous-ressources assets (css/js du site embarqué).
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowContentAccess(true);
        webView.setWebViewClient(new WebViewClient());
        webView.addJavascriptInterface(new JsBridge(), "AndroidBridge");

        // <input type="file"> → sélecteur de fichiers Android (import JSON)
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> cb,
                                             FileChooserParams params) {
                fileCallback = cb;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT)
                        .addCategory(Intent.CATEGORY_OPENABLE)
                        .setType("application/json");
                try {
                    startActivityForResult(Intent.createChooser(i, "Programme JSON"), FILE_REQUEST);
                } catch (Exception e) {
                    fileCallback = null;
                    return false;
                }
                return true;
            }
        });

        webView.loadUrl("file:///android_asset/index.html");
        setContentView(webView);
    }

    /**
     * Pont JS → Android pour l'export JSON : un lien blob:/data: ne passe
     * pas par DownloadManager dans un WebView file://, donc la page appelle
     * AndroidBridge.saveJson(name, base64) qui écrit dans Téléchargements.
     */
    private class JsBridge {
        @JavascriptInterface
        public void saveJson(String filename, String base64) {
            try {
                byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues v = new ContentValues();
                    v.put(MediaStore.Downloads.DISPLAY_NAME, filename);
                    v.put(MediaStore.Downloads.MIME_TYPE, "application/json");
                    Uri uri = getContentResolver().insert(
                            MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
                    if (uri == null) throw new IllegalStateException("insert null");
                    try (OutputStream os = getContentResolver().openOutputStream(uri)) {
                        os.write(bytes);
                    }
                } else {
                    java.io.File dir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                    try (OutputStream os = new java.io.FileOutputStream(
                            new java.io.File(dir, filename))) {
                        os.write(bytes);
                    }
                }
                runOnUiThread(() -> Toast.makeText(MainActivity.this,
                        "Exporté : " + filename, Toast.LENGTH_SHORT).show());
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(MainActivity.this,
                        "Export impossible", Toast.LENGTH_SHORT).show());
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_REQUEST) {
            if (fileCallback != null) {
                Uri[] uris = (resultCode == RESULT_OK && data != null && data.getData() != null)
                        ? new Uri[]{ data.getData() } : null;
                fileCallback.onReceiveValue(uris);
                fileCallback = null;
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
