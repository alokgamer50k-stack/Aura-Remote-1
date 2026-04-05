
[app]
title = Aura Stealth
package.name = aurastealth
package.domain = org.alok.remote
source.dir = .
source.include_exts = py,png,jpg,kv,atlas
version = 2.0
requirements = python3,kivy
android.permissions = SYSTEM_ALERT_WINDOW, RECEIVE_BOOT_COMPLETED, FOREGROUND_SERVICE, INTERNET
android.api = 28
android.minapi = 21
android.archs = armeabi-v7a, arm64-v8a
orientation = landscape
services = StealthService:service.py
[buildozer]
log_level = 2
warn_on_root = 1
