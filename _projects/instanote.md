---
title: InstaNote
summary: Android widget app for instant note capture with one-tap email delivery via Gmail API
date: 2024-05-14
---

## Overview

InstaNote is a native Android app designed for frictionless note capture. It features a home screen widget that bypasses the standard app launch flow, presenting a minimal overlay where users can type a note and instantly email it to themselves with a single tap.

The app integrates directly with the Gmail API using OAuth2, eliminating the need to open an email client or configure SMTP settings. This makes it ideal for quickly logging thoughts, saving links, or forwarding content from other apps.

## Screenshots

<!-- SCREENSHOT: Home screen widget showing the "Add Note" button on Android launcher -->
![Widget on home screen](/images/projects/instanote/screenshot-1.png)

<!-- SCREENSHOT: Note entry overlay with text input and action buttons (discard, share, attach, send) -->
![Note entry interface](/images/projects/instanote/screenshot-2.png)

<!-- SCREENSHOT: Main app showing list of saved notes with delete buttons -->
![Notes list view](/images/projects/instanote/screenshot-3.png)

<!-- SCREENSHOT: Settings screen with Google Sign-In status and version info -->
![Settings with Google account](/images/projects/instanote/screenshot-4.png)

## Problem

Traditional note-taking apps require multiple taps to open, create a new note, and then share or email it. When capturing fleeting thoughts or saving content from another app, this friction often means the moment passes before the note is recorded.

Existing solutions either require manual email configuration, open a separate email client (adding more steps), or don't support direct content sharing from other apps.

## Approach

InstaNote reduces capture friction to near-zero by combining three techniques:

1. **Widget-First Design** - A home screen widget launches directly into a transparent note-entry overlay, skipping the app entirely
2. **Gmail API Integration** - Notes are sent directly through the user's Gmail account without opening an email client
3. **Share Intent Receiver** - Content shared from any app is automatically emailed without UI interruption

### Stack

- **Kotlin** - Modern Android development with coroutines for async email operations
- **Gmail API** - Direct email sending with OAuth2 authentication, eliminating SMTP configuration
- **AppWidgetProvider** - Native home screen widget implementation for quick access
- **Google Sign-In** - Seamless OAuth2 flow with gmail.send scope for secure API access
- **ViewBinding** - Type-safe view access without findViewById boilerplate
- **SharedPreferences + Gson** - Lightweight local storage for note persistence
- **JavaMail API** - MIME message construction for email content and attachments

### Challenges

- **Transparent Overlay Activity** - Creating a note entry screen that floats above the home screen required careful window attribute configuration with `TransparentActivity` theme, `singleInstance` launch mode, and `excludeFromRecents` flag to prevent it appearing in the recents screen

- **Share Intent Handling** - Receiving shared content from other apps and immediately sending it via email without showing UI required handling both `ACTION_SEND` and `ACTION_SEND_MULTIPLE` intents with early returns before inflating the layout

- **OAuth2 Scope Management** - The Gmail API requires the `gmail.send` scope which triggers additional Google security verification. Implemented proper credential management with `GoogleAccountCredential` and `GoogleSignIn.getLastSignedInAccount()` to persist authentication state

- **File Attachments** - Supporting arbitrary file types from share intents required building multipart MIME messages with `MimeMultipart` and `ByteArrayDataSource` for content resolution from URIs

## Outcomes

The app achieves its goal of minimal-friction note capture. From widget tap to email sent takes approximately 3 seconds - type and tap send. The share intent integration makes it particularly useful as a "send to self" utility that works from any app.

Key learnings from this project:
- Android widgets are powerful for quick-action use cases but have strict RemoteViews limitations
- Gmail API is more reliable than SMTP for personal use, but requires Google Cloud Console setup
- Transparent activities with keyboard auto-focus require careful window manager configuration
- Handling share intents gracefully means sometimes processing data without ever showing UI

## Implementation Notes

The note entry activity uses a transparent theme and positions itself at the bottom of the screen:

```kotlin
val params = window.attributes
params.width = WindowManager.LayoutParams.MATCH_PARENT
params.gravity = Gravity.BOTTOM
window.attributes = params
```

Share intents are processed immediately without inflating the UI:

```kotlin
when (intent?.action) {
    Intent.ACTION_SEND -> {
        handleShareIntent(intent)
        return  // Prevents UI creation
    }
}
```

Email sending runs on a background dispatcher with proper exception handling:

```kotlin
lifecycleScope.launch(Dispatchers.IO) {
    try {
        val gmailService = setupGmailService()
        gmailService.users().messages().send("me", email).execute()
        withContext(Dispatchers.Main) {
            Toast.makeText(this@NoteEntryActivity, "Email sent", Toast.LENGTH_SHORT).show()
            finish()
        }
    } catch (e: Exception) {
        // Handle error on main thread
    }
}
```

The widget provider uses a `PendingIntent` to launch the note entry directly:

```kotlin
val intent = Intent(context, NoteEntryActivity::class.java)
intent.putExtra("isFromWidget", true)
val pendingIntent = PendingIntent.getActivity(
    context, 0, intent, 
    PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
)
views.setOnClickPendingIntent(R.id.widget_layout, pendingIntent)
```
