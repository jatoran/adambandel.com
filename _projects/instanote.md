---
title: InstaNote
summary: An Android app that sends quick notes, links and photos to your own Gmail from a home screen widget or the share menu
type: android
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

InstaNote is an Android app for getting a note down fast.
A slim home screen widget opens a text box with the keyboard already up, and one more tap sends the note to your own Gmail inbox.
Other apps can share to it as well, so a link, a photo or any other file goes straight to your email without opening a screen.

It signs in with Google and sends through the Gmail API, attachments included, to your own address, so the inbox is where the notes end up.

## Screenshots

<!-- SCREENSHOT: Main screen showing the notes list with toolbar and floating action button -->
![Notes List](/images/projects/instanote/screenshot-1.png)

<!-- SCREENSHOT: Note entry dialog showing the text input and action buttons (discard, share, attach, email) -->
![Note Entry](/images/projects/instanote/screenshot-2.png)

<!-- SCREENSHOT: Home screen widget placed on the Android launcher -->
![Home Screen Widget](/images/projects/instanote/screenshot-3.png)

## Problem

A normal notes app takes several steps before you can type: unlock the phone, find the app, wait for it to load, tap new note.
A passing thought is often gone by then.

Quick notes also often need to end up somewhere more permanent, like an email inbox, where they get dealt with alongside everything else.
The standard Android share flow adds steps of its own when all you want is to email yourself.

## Approach

Two things keep capture short: the widget opens straight into note entry, and the app sends the email itself instead of handing off to a mail app.

### Stack

- Kotlin, with coroutines for the async work
- Android SDK 34 as the target, running on Android 7.0 (API 24) and up
- Jetpack Compose and View Binding are both in the build; the screens are traditional layouts through View Binding
- Gmail API, to send email without opening another app
- Google Sign-In, for the OAuth2 access the Gmail API needs
- SharedPreferences for local note storage, serialized to JSON with Gson

### Challenges

- Sending through the Gmail API meant building MIME messages with JavaMail on Android and Base64-encoding the raw email. `MimeMultipart` carries the text body alongside any attachments.

- The home screen widget had to launch straight into the note entry screen. It passes an `isFromWidget` flag through its PendingIntent, and the activity adjusts its behavior when the flag is set.

- Deleting a note takes a second tap instead of a dialog. The first tap turns the delete button red and changes it to "CONFIRM", and it reverts after 2 seconds if the second tap doesn't come, timed with `Handler.postDelayed()`.

- The app accepts both `ACTION_SEND` (one item) and `ACTION_SEND_MULTIPLE` (several files) from other apps, and emails the shared content to you without showing any screen.

## Outcomes

Fast note entry was what I wanted from this, and that's what it gives me.
I use it every day to send myself notes.

Building it meant working out the Gmail API sign-in flow on Android with `GoogleAccountCredential`, MIME message construction with `javax.mail`, a RecyclerView with its own delete confirmation, and an app widget that launches an activity through a PendingIntent.

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
