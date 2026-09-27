plugins {
    id("com.android.application")
}

android {
    namespace = "com.pulse.fitness"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.pulse.fitness"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "0.1.0"
    }

    // Le contenu web/ est la source de vérité partagée entre la version
    // navigateur et l'APK : il est embarqué tel quel dans les assets.
    sourceSets {
        named("main") {
            assets.srcDirs("../../web")
        }
    }
}
