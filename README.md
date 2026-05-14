# Personal Contact Form Website

This is a small website about you. People can read about you, write feedback or kindness, and the backend stores their messages.

## Contact Form

The form sends messages to the backend endpoint:

```text
POST /api/messages
```

Messages are saved locally in:

```text
data/messages.json
```

That file is ignored by git so private visitor messages are not uploaded to GitHub.

## Open The Website

Run:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

Do not open `index.html` directly when testing the form. The backend must be running so messages can be stored.

## Edit Your Details

Change the text in `index.html` to add your name, real favorites, movies, games, gym goals, photos, or anything else you want people to know.
