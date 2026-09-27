package com.pulse.fitness;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Shell natif de Pulse : un WebView plein écran qui charge l'app web
 * embarquée dans les assets (dossier ../web partagé avec la version
 * navigateur). JS + DOM storage activés pour le suivi localStorage.
 */
public class MainActivity extends Activity {

    private static final int BG = Color.parseColor("#0b0d10");
    private WebView webView;

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
        webView.loadUrl("file:///android_asset/index.html");

        setContentView(webView);
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
