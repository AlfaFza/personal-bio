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

## Deploy To Vercel

This project includes a Vercel API route at `api/messages.js`. The `local-server.js` file is only for running the message store on your computer.

Important: Vercel does not permanently store writes to local JSON files. For production message storage, connect a hosted database such as Vercel KV, Vercel Postgres, or Supabase and update `api/messages.js` to save there.

## Edit Your Details

Change the text in `index.html` to add your name, real favorites, movies, games, gym goals, photos, or anything else you want people to know.
