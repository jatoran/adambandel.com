---
title: InstaNote
summary: Android note-taking app with home screen widget and one-tap Gmail integration
type: desktop
stack:
  - Kotlin
  - Android SDK
  - Jetpack Compose
  - Gmail API
  - Google Sign-In
tags:
  - mobile
  - productivity
  - android
loc: 984
files: 31
architecture:
  auth: OAuth
  database: none
  api: REST
  realtime: none
  background: none
  cache: none
  search: none
---

## Overview

InstaNote is a lightweight Android application designed for capturing thoughts instantly. The app features a home screen widget that opens a note entry dialog with a single tap, allowing users to quickly jot down ideas without navigating through multiple screens. Notes can be sent directly to your Gmail inbox with one tap, making it easy to transfer quick captures to a more permanent location.

The app integrates with Google Sign-In for authentication and uses the Gmail API to send notes (with optional file attachments) directly to the user's own email address, effectively turning your inbox into a note repository.

## Screenshots

<!-- SCREENSHOT: Main screen showing the notes list with toolbar and floating action button -->
![Notes List](/images/projects/instanote/screenshot-1.png)

<!-- SCREENSHOT: Note entry dialog showing the text input and action buttons (discard, share, attach, email) -->
![Note Entry](/images/projects/instanote/screenshot-2.png)

<!-- SCREENSHOT: Home screen widget placed on the Android launcher -->
![Home Screen Widget](/images/projects/instanote/screenshot-3.png)

## Problem

Traditional note-taking apps require multiple steps: unlock phone, find app, wait for load, tap new note, then finally start typing. This friction means fleeting thoughts are often lost before they can be captured.

Additionally, quick notes often need to reach a more permanent destination—email inboxes, where they can be processed alongside other tasks. The standard Android share flow adds unnecessary steps when you just want to email yourself.

## Approach

Built a minimal-friction capture flow with two key features:

### Stack

- **Kotlin** - Modern Android language with coroutines for async operations
- **Android SDK 34** - Targets latest Android while supporting devices back to API 24 (Android 7.0)
- **Jetpack Compose + View Binding** - Hybrid UI approach using ViewBinding for traditional layouts
- **Gmail API** - Direct integration for sending emails without opening another app
- **Google Sign-In** - OAuth2 authentication for Gmail API access
- **SharedPreferences** - Local note storage using JSON serialization via Gson

### Challenges

- **Gmail API Integration** - Constructing MIME messages with attachments required working with JavaMail on Android, including proper Base64 encoding for the raw email content. Used `MimeMultipart` to handle text bodies alongside file attachments.

- **Widget-to-Activity Communication** - The home screen widget needed to launch directly into the note entry screen. Solved by passing an `isFromWidget` flag via PendingIntent, allowing the activity to adjust its behavior accordingly.

- **Delete Confirmation UX** - Implemented a 2-second confirmation window for deletions without a modal dialog. First tap changes the delete button to "CONFIRM" with red background, auto-reverts after 2 seconds if not confirmed. Uses `Handler.postDelayed()` for timing.

- **Share Intent Handling** - The app receives both `ACTION_SEND` (single item) and `ACTION_SEND_MULTIPLE` (multiple files) intents, automatically emailing shared content to the user without showing UI.

## Outcomes

The app achieves its core goal of minimal-friction note capture. The widget provides one-tap access, and the email integration means notes automatically arrive in Gmail for later processing.

Key technical learnings:
- Gmail API authentication flow on Android using `GoogleAccountCredential`
- MIME message construction with `javax.mail` on Android
- RecyclerView patterns with custom deletion confirmation
- AppWidget development with PendingIntent for activity launching

## Implementation Notes

### Email with Attachments

The core email sending logic handles both plain text and multipart messages:

```kotlin
private fun createEmailWithAttachments(
    to: String, from: String, subject: String,
    uris: List<Uri>, bodyText: String
): MimeMessage {
    val email = MimeMessage(session)
    email.setFrom(InternetAddress(from))
    email.addRecipient(Message.RecipientType.TO, InternetAddress(to))
    email.subject = subject

    val multipart = MimeMultipart()

    // Text body
    val textPart = MimeBodyPart()
    textPart.setText(bodyText)
    multipart.addBodyPart(textPart)

    // Attachments
    for (uri in uris) {
        val attachmentPart = MimeBodyPart()
        val inputStream = contentResolver.openInputStream(uri)
        val dataSource = ByteArrayDataSource(inputStream, contentResolver.getType(uri))
        attachmentPart.dataHandler = DataHandler(dataSource)
        attachmentPart.fileName = getFileName(uri)
        multipart.addBodyPart(attachmentPart)
    }

    email.setContent(multipart)
    return email
}
```

### Delete Confirmation Pattern

The adapter implements a timed confirmation without dialogs:

```kotlin
holder.binding.deleteButton.setOnClickListener {
    if (isPendingDeletion) {
        onDelete(adapterPos)
        pendingDeletionPosition = null
    } else {
        pendingDeletionPosition = adapterPos
        notifyDataSetChanged()

        handler.postDelayed({
            if (pendingDeletionPosition == adapterPos) {
                pendingDeletionPosition = null
                notifyDataSetChanged()
            }
        }, 2000)
    }
}
```

### Project Structure

```
InstaNote/
├── app/src/main/
│   ├── java/com/instanote/
│   │   ├── MainActivity.kt        # Note list management
│   │   ├── NoteEntryActivity.kt   # Note creation/editing + Gmail
│   │   ├── NoteAdapter.kt         # RecyclerView with delete confirm
│   │   ├── SettingsActivity.kt    # Google auth management
│   │   └── NoteWidgetProvider.kt  # Home screen widget
│   └── res/
│       ├── layout/                # 5 layout files
│       └── xml/note_widget_info.xml
└── build.gradle.kts               # Dependencies + SDK config
```
