# Node.js Practise Task 2

A plain Node.js HTTP server (no Express) that stores every submitted message in a
file and shows **all** of them above the form — newest message first.

## Routes

| Method | Route      | What it does                                                    |
| ------ | ---------- | --------------------------------------------------------------- |
| GET    | `/`        | Reads `messages.txt`, renders the list above the form             |
| POST   | `/message` | Appends the message to `messages.txt`, then 302 redirects to `/` |

## How it works

1. **POST** — the body arrives in chunks (`req.on("data")`), is joined with
   `Buffer.concat()` on `req.on("end")`, and `split("=")[1]` pulls the value out of
   `message=hello+world`.
2. `+` is swapped back to a space and `decodeURIComponent()` undoes the URL encoding,
   so `my+name+is+yash` is stored as `my name is yash`.
3. `fs.appendFile()` adds it on a new line — appending, not overwriting, is what keeps
   the earlier messages around.
4. `res.statusCode = 302` + `Location: /` sends the browser back to the form.
5. **GET /** — `fs.readFile()` loads the file, `split("\n")` turns it into an array,
   blank lines are filtered out, and `.reverse()` puts the newest message on top before
   it is rendered into the HTML.

Empty submissions are ignored and just redirect back.

## Run

```bash
npm start
```

Then open http://localhost:3000
