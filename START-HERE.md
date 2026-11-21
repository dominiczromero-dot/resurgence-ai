# Resurgence AI: setup in plain steps

You'll end up with a web link (on your phone too) that updates itself every morning around 5 AM Pacific with real YouTube data. It's free and needs no vidIQ.

It takes about 20 minutes. You need a Google account and a GitHub account.

---

## Part 1: get a free YouTube API key (about 5 minutes)

1. Go to **console.cloud.google.com** and sign in with Google.
2. At the top, click the project picker, then **New project**. Name it `resurgence-ai` and click **Create**. Make sure it's selected afterwards.
3. In the search bar, type **YouTube Data API v3**, open it, and click **Enable**.
4. In the left menu, go to **APIs & Services → Credentials**. Click **+ Create credentials → API key**.
5. Copy the key (it starts with `AIza…`) and keep it somewhere safe for Part 2.
6. Click the key's name. Under **API restrictions**, choose **Restrict key**, tick **YouTube Data API v3**, and click **Save**.
   Leave "Application restrictions" set to **None**, or the daily job will be blocked.

It's free: you get 10,000 units a day, and one research run uses about 1,000–1,600.

---

## Part 2: put the app on GitHub (about 10 minutes)

1. Go to **github.com** and sign up or sign in.
2. Click **+** (top right) → **New repository**.
   - Name: `resurgence-ai`
   - Choose **Public**. Free GitHub Pages needs a public repo. Only public YouTube data goes in it, and your key stays secret.
   - Click **Create repository**.
3. On the new repo page, click **uploading an existing file**.
   Unzip `resurgence-ai.zip`, open the folder, and drag in **everything you can see**: `index.html`, `core.js`, `config.json`, `package.json`, `README.md`, `START-HERE.md`, `workflow-to-paste.yml` and the `scripts` folder.
   Click **Commit changes**.
4. Add the daily schedule file:
   - Click **Add file → Create new file**.
   - In the name box, type exactly: `.github/workflows/daily-research.yml`. The slashes create the folders.
   - Open `workflow-to-paste.yml` from the zip, copy all of it, and paste it into the big box.
   - Click **Commit changes**.

---

## Part 3: give GitHub your key and permission to save (about 2 minutes)

1. In your repo, click **Settings** (the tab at the top of the repo).
2. Left menu: **Secrets and variables → Actions → New repository secret**.
   - Name: `YT_API_KEY`
   - Secret: paste your key from Part 1
   - Click **Add secret**.
3. Left menu: **Actions → General**. Scroll to **Workflow permissions**, choose **Read and write permissions**, and click **Save**.

---

## Part 4: run it the first time (about 3 minutes)

1. Click the **Actions** tab at the top of the repo.
   If GitHub asks, click **I understand my workflows, go ahead and enable them**.
2. Click **Daily Resurgence research** on the left, then **Run workflow → Run workflow**.
3. Wait 1–3 minutes until it shows a **green check**.
   A red X means something went wrong. Click it, copy the error text, and send it to me.

The run creates a `data` folder and a `reports` folder in your repo. `reports/latest.md` is your written daily report.

---

## Part 5: turn on your dashboard link (about 2 minutes)

1. **Settings → Pages**.
2. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main**, folder **/ (root)**, then click **Save**.
3. Wait about a minute and refresh the page. Your link appears at the top:
   `https://YOUR-USERNAME.github.io/resurgence-ai/`
4. Open it and bookmark it on your phone.

From now on, GitHub updates the research every morning by itself.

---

## Using it

- **Today**: what's trending, who's gaining views, and the #1 video to make right now.
- **My ideas**: type your own ideas in plain words, for example "M4 Hurricane high-kill game". Each one is scored against this week's real videos.
- **Title ranker**: paste your titles one per line. They're ranked, with the reason behind every point.
- **Top 10 / Trends / Weapons / Viral detector / Competitors / History / Daily report**: the full research.

Your ideas and titles are saved in the browser you typed them in, so phone and computer each keep their own lists.

## Changing what it tracks

Edit `config.json` on GitHub: open the file, click the ✏️ pencil, then **Commit changes**.
- Add a creator: add a line such as `{ "input": "@theirhandle" },` inside `competitors`.
- New season weapons: add a `"weapons": [ ... ]` list (see README.md).

## Want a fresh update right now?

**Actions → Daily Resurgence research → Run workflow**. You can do this several times a day within the free quota.
