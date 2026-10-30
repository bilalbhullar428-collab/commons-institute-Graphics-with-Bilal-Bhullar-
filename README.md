# Commons Client Gallery (v2) — The Commons Institute

A static, zero-backend, zero-database client design portal built for **The Commons Institute** (CSS/PMS Exam-Prep Academy). Share a single link in your WhatsApp client group so members can browse finished Posters and Carousels on their phones, check live studio counts, approve designs, leave revision comments, submit new scripts, and download **100% original Full-HD files** directly from Google Drive.

---

## Package Contents

| File | Purpose |
| :--- | :--- |
| `index.html` | Main single-page web app (Live Dashboard Strip, Organized Status Sections, Job Detail View with Approve & Comment Box, Submit New Script View, and Full-Screen Lightbox). |
| `style.css` | Mobile-first responsive stylesheet in The Commons Institute brand palette (Navy `#1A2B4A`, Cream `#FAF6F0`, Maroon `#8B1E24`), tested at `360px` phone and desktop widths with zero horizontal scroll. |
| `app.js` | Top-level `APP_CONFIG` object + client-side logic for live dashboard counts, status sections, auto-refresh (`Updated HH:MM`), Google Form submissions, clipboard summaries, and Drive image fallbacks. |
| `jobs.json` | **Single source of truth** for studio config and all client-visible jobs. Includes 2 realistic `[SAMPLE]` CSS/PMS jobs. |
| `logo.png` | Official crest logo for The Commons Institute. |
| `README.md` | Complete deployment and operations guide. |

---

## 1. Free Deployment in Under 10 Minutes ($0 Static Hosting)

Because this app uses plain HTML, CSS, JS, and `jobs.json` (no database, no backend, no build step), you can host it for **$0/month** on any static host:

### Option A: Cloudflare Pages (Drag-and-Drop — Fastest, ~2 Minutes)
1. Unzip `commons-client-gallery.zip` on your computer.
2. Sign in to [Cloudflare Dashboard](https://dash.cloudflare.com/) (free account) → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
3. Enter a project name (e.g., `commons-client-gallery`) and click **Create project**.
4. Drag and drop the unzipped folder into the upload box and click **Deploy site**.
5. Share your `.pages.dev` link with the client WhatsApp group. Whenever you edit `jobs.json`, drag-and-drop the folder to update the live site in seconds.

### Option B: Netlify Drop (~2 Minutes)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop) (free account).
2. Drag and drop the unzipped `commons-client-gallery` folder onto the page.
3. Your site goes live immediately over HTTPS. Re-drop the folder anytime you update `jobs.json`.

### Option C: GitHub Pages (Best for Editing `jobs.json` Directly in Your Browser)
1. Create a repository on [GitHub](https://github.com/) and upload `index.html`, `style.css`, `app.js`, `jobs.json`, `logo.png`, and `README.md`.
2. Go to **Settings** → **Pages**, and under **Build and deployment**, select **Deploy from a branch** → `main` / `/ (root)` → **Save**.
3. Whenever you add a job or change a job's status in `jobs.json` via GitHub's web editor and commit, connected clients will automatically pick up the changes (the app auto-refreshes `jobs.json` every 5 minutes and whenever the browser tab regains focus).

---

## 2. How to Add a New Job

All images stay in Google Drive. The app never stores or re-uploads image bytes.

1. **Upload HD Finals to Google Drive**: Upload your finished PNG/JPG slides to your Drive folder. Right-click the folder or files → **Share** → set General access to **"Anyone with the link"** (**Viewer**) so all 7–8 group members can view and download without Google sign-in prompts.
2. **Copy Each Image's `FILE_ID`**:
   From a Drive share link like `https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz123456/view?usp=sharing`, copy the ID between `/d/` and `/view`.
3. **Append an Entry to `jobs.json`**:
   - `thumb`: `https://drive.google.com/thumbnail?id=FILE_ID&sz=w1000`
   - `download`: `https://drive.google.com/uc?export=download&id=FILE_ID` (returns the uncompressed original file)

```json
{
  "id": "job-2026-11-02-css-ir",
  "date": "2026-11-02",
  "topic": "CSS 2027 International Relations Seminar Carousel",
  "type": "Carousel",
  "version": "V1",
  "status": "awaiting-approval",
  "slideCount": 2,
  "zipDownload": "https://drive.google.com/uc?export=download&id=OPTIONAL_ZIP_FILE_ID",
  "slides": [
    {
      "name": "Slide 01 — Cover",
      "thumb": "https://drive.google.com/thumbnail?id=YOUR_SLIDE_1_FILE_ID&sz=w1000",
      "download": "https://drive.google.com/uc?export=download&id=YOUR_SLIDE_1_FILE_ID"
    },
    {
      "name": "Slide 02 — Key Topics & Faculty",
      "thumb": "https://drive.google.com/thumbnail?id=YOUR_SLIDE_2_FILE_ID&sz=w1000",
      "download": "https://drive.google.com/uc?export=download&id=YOUR_SLIDE_2_FILE_ID"
    }
  ]
}
```

---

## 3. How to Change a Job's Status & How Home Sections Work

Each job in `jobs.json` has a `"status"` field. Valid values are:
- `"awaiting-approval"` — Shown to client, approval pending *(default if `"status"` is omitted, preserving 100% backward compatibility with v1)*. Rendered as full cards first on Home.
- `"pending"` — Currently being made by the studio. Rendered as full cards second on Home.
- `"approved"` — Approved by the client. Rendered as a compact, job-names-only list third on Home (tapping any name opens its full Job View).
- `"delivered"` — Finalized and delivered. Rendered as a compact, job-names-only list fourth on Home (tapping any name opens its full Job View).

**Automatic Badges & Grouping**:
- **Live Dashboard Strip**: Automatically counts Total Designs, Total Slides, Posters, Carousels, Awaiting Approval, Pending, Approved, and Delivered directly from `jobs.json`.
- **`Latest` Badge**: Automatically appears on any job less than 7 days old.
- **`Past months` Collapsible Section**: Jobs from earlier months are automatically grouped under a collapsible **"Past months"** bar at the bottom of Home so the main gallery never clutters.

---

## 4. Connecting the Google Form (Approvals, Comments & New Scripts)

Static websites cannot run a backend database, so the app submits Approvals, Revision Comments, and New Scripts directly to a **Google Form** (which logs every response into a Google Sheet and emails you automatically) while also copying a clean summary to the client's clipboard to paste in WhatsApp if they wish.

### Step 1: Create Your Google Form & Set Permissions
1. Go to [forms.google.com](https://forms.google.com/) and create a form with Short Answer / Paragraph questions for the fields you want to log (e.g., `Job ID`, `Topic`, `Type`, `Version`, `Decision`, `Comment`, `Reviewer Name`, `New Script`, `Timestamp`).
2. In the **Settings** tab of your Google Form:
   - Under **Responses**, turn **OFF** *"Collect email addresses"* and turn **OFF** *"Limit to 1 response"* (so **"Anyone with the link can respond" with NO Google sign-in required**).
3. In the **Responses** tab of your Google Form:
   - Click the three dots (`⋮`) and check **"Get email notifications for new responses"** so you are alerted immediately.
   - Optionally click **Link to Sheets** to view all approvals, comments, and scripts in a spreadsheet.

### Step 2: Get Your `formActionUrl` and `entry.XXXXXXX` IDs
1. Click the three dots (`⋮`) in the top-right of your Google Form → **Get pre-filled link**.
2. Type sample words into each field (e.g., `JOBID_HERE`, `TOPIC_HERE`), click **Get link** → **Copy link**, and paste it into a text editor.
3. The copied URL will look like:
   ```text
   https://docs.google.com/forms/d/e/1FAIpQLSdAbCdEfGhIjKlMnOpQrStUvWxYz/viewform?usp=pp_url&entry.111111=JOBID_HERE&entry.222222=TOPIC_HERE
   ```
4. Replace `/viewform?...` at the end with `/formResponse` to get your `formActionUrl`:
   ```text
   https://docs.google.com/forms/d/e/1FAIpQLSdAbCdEfGhIjKlMnOpQrStUvWxYz/formResponse
   ```
5. Copy the `entry.XXXXXXX` numbers into `APP_CONFIG` at the very top of `app.js`:

```javascript
var APP_CONFIG = {
  studioName: "The Commons Institute",
  subtitle: "CSS / PMS Design Deliverables Portal",
  logo: "logo.png",
  footerText: "The Commons Institute • Bilal Bhullar",

  formActionUrl: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse",

  formFields: {
    approval: {
      jobId: "entry.1000001",
      topic: "entry.1000002",
      type: "entry.1000003",
      version: "entry.1000004",
      decision: "entry.1000005",
      timestamp: "entry.1000006"
    },
    comment: {
      jobId: "entry.2000001",
      topic: "entry.2000002",
      type: "entry.2000003",
      version: "entry.2000004",
      comment: "entry.2000005",
      name: "entry.2000006",
      timestamp: "entry.2000007"
    },
    newScript: {
      script: "entry.3000001",
      comment: "entry.3000002",
      timestamp: "entry.3000003"
    }
  },
  // ...
};
```
> **Note**: Until you replace `"PLACEHOLDER_GOOGLE_FORM_ACTION_URL"`, tapping **Approve Design**, **Submit Comment**, or **Submit Script** still shows the confirmation banner, copies the formatted summary to the client's clipboard, and notes *"recording will activate once the Form is connected"*.

---

## 5. Setting the Client Uploads Google Drive Folder URL

Because a static webpage cannot upload binary files directly into Google Drive without requiring a Google OAuth login, the **Submit New Script** view provides a dedicated button to open your shared **Client Uploads Drive Folder** (or clients can send uncompressed images as WhatsApp documents).

1. Create a folder in Google Drive named `Commons Client Uploads`.
2. Right-click the folder → **Share** → set General access to **"Anyone with the link"** (**Editor**).
3. Copy the folder link and paste it into `APP_CONFIG.clientUploadsFolderUrl` at the top of `app.js`:
   ```javascript
   clientUploadsFolderUrl: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
   ```

---

## 6. Removing an Old Job (Weekly / Monthly Cleanup)

1. Open `jobs.json`.
2. Delete the old job's `{ ... }` object from the `"jobs"` array.
3. Save and redeploy. All dashboard counts, status sections, and filters update automatically without breaking the app.

---

## 7. Changing the Header Logo, Studio Name, or Footer Credit Text

- **Footer Credit Text**: By default, the footer displays `"The Commons Institute • Bilal Bhullar"`. You can change `"footerText"` in `jobs.json` (under `"config"`) or in `APP_CONFIG.footerText` at the top of `app.js`.
- **Header Logo & Title**: Edit `"studioName"`, `"subtitle"`, or `"logo"` in `jobs.json` (under `"config"`) or replace `logo.png` in the project folder.

## Live site
https://bilalbhullar428-collab.github.io/commons-institute-Graphics-with-Bilal-Bhullar-/

## v2.2 (2026-10-28) — client intake completed + clean lightbox
- Lightbox is 100% clean: the X/Y badge moved into the header (carousel only, like an IG post header); prev/next arrows moved BELOW the image, flanking the dots. Nothing overlays the image.
- Client Uploads folder now points to the PERMANENT veo3 folder (was the old 428 folder — fixed). Sharing must be "Anyone with the link" -> Writer/Editor; proven on the first real client upload.
- New Script form now takes Topic (required) + Type Poster/Carousel (required) + Script + Related Comment + Uploaded file names (optional, appended to the Related Comment). Topic/Type land in the Responses Sheet's Topic/Type columns.
- Upload panel is a 3-step flow: open folder -> upload -> write file names in the script form. WhatsApp documents remain the fallback.
- "Scripts Mili" section (home, text cards: topic + type + date, no images) reads scripts.json. "Pehle Mukammal Kaam (WhatsApp)" reads past-jobs.json (name + date only, marked "WhatsApp par mukammal hua") and stays hidden while empty.
- How Muse updates them: a real script arriving in the Responses Sheet (Comment/Script filled, no Job ID) -> append {topic, type, date} to scripts.json. A past WhatsApp job -> append {name, date} to past-jobs.json ONLY on Bilal's instruction. Neither file is ever touched by ChatGPT (the pakka prompt only appends job entries to jobs.json).
- FALLBACK_DATA jobs emptied: with jobs.json clean, a failed fetch must never resurrect a test job.
- Header crest still uses the proven 428-Drive thumbnail (veo3 logo thumbnail not yet proven to serve) — switch only after a proven veo3 thumbnail check.

## v2.3 — Types: Thumbnail + Cover, standard sizes, size-aware display
- New job types: Thumbnail and Cover, alongside Poster and Carousel.
  Filter pills: All / Posters / Carousels / Thumbnails / Covers.
  New Script form Type select: Poster / Carousel / Thumbnail / Cover.
- Dashboard counting rule (unchanged code, now explicit): every
  NON-Carousel job counts as a Poster — so single-image jobs
  (Poster, Thumbnail, Cover, any future single-image type) are
  summed under "Posters". Carousels count only type == Carousel.
- Standard sizes (built once; script overrides defaults):
  Poster 1080×1350 (4:5); Carousel slide 1080×1350; Thumbnail
  1280×720 (16:9); Cover 820×312 (Facebook cover; other platforms
  use the script size); Square post 1080×1080; Story/Status
  1080×1920 (9:16). The pakka prompt carries this table; ChatGPT
  records the job's actual size in the jobs.json `size` field.
- Size-aware display: job cards now use object-fit: contain (was
  cover), so every design shows FULLY in its own shape instead of
  being cropped to the 4:3 card frame (cream letterbox bars fill
  the rest). Lightbox already used contain (no crop). The lightbox
  subtitle now shows the size when the job carries one
  ("topic • Type (V1) • 1280×720"); jobs without `size` render
  exactly as before.
- Google Form note: the Form's "Type" question is a TEXT question,
  so Thumbnail/Cover values submit with no Form change; only its
  description text was updated to name all four types.
- Muse updates jobs.json `size` only via the pakka prompt route;
  ChatGPT never touches scripts.json or past-jobs.json.

## v2.4 — One card per topic, versions inside (grouped home)
- Home now shows ONE card per topic (unwan), not one card per
  version. The 6 live entries (Dolce x3, English Essay x3)
  collapse to 2 topic cards. Clicking a topic opens its detail
  view: one section per version (V1, V2, V3, ... up to 8+),
  each with its own slides, size, status, View/Download and its
  own "Approve This Version" button. Approval stays per-version
  (the client approves the version they like); an approved
  version shows "Approved ✓" instead of a button. One Comment
  Box per topic with a version picker (the comment is recorded
  against the chosen version); the lightbox Comment button jumps
  to the topic and pre-selects that version.
- Grouping rule: entries with the same topic (case-insensitive,
  extra spaces ignored) form one group; versions sort V1..Vn;
  a group's home section follows its LATEST version's status.
  The card image is the latest version's first slide.
- NO data-model change: jobs.json stays one entry per version,
  so ChatGPT, the Form, the bridge and Supabase all work
  unchanged. A new version with a matching topic name appears
  inside its topic automatically (pakka prompt now carries the
  topic-must-match rule). Dashboard counts still count versions
  (files); home section counts count topics; the results line
  shows both ("2 topics (6 versions)").
- Clean images (default IG/carousel card, refined): home cards
  no longer overlay badges on the picture — type, version count,
  status and Latest live in the meta row below. Detail slides
  likewise lost their on-image number pill and "Tap to View"
  hint (the slide position now sits under the image; Full Screen
  + Download HD buttons were already there).
- Also fixed: the lightbox status line passed job.status instead
  of the job object to getJobStatus, so it always read "Awaiting
  Approval" — now it shows the version's real status.
- Muse updates jobs.json grouping only via this code; ChatGPT
  never touches grouping, scripts.json or past-jobs.json.

## v2.5 (30 Oct 2026) — title-list home, fixed approved-0, history
- DIAGNOSIS of the approved-0 report (30 Oct morning): the
  Form -> Sheet -> bridge -> Supabase pipeline was HEALTHY
  (both approvals landed in Supabase within 1 second). The bug
  was display-side, two rules: (a) v2.4's "group section = latest
  version's status" kept an approved topic in Awaiting whenever a
  newer version was unapproved; (b) the dashboard strip rendered
  only on jobs.json fetch, never after the Supabase overlay, so
  it showed Approved 0 until the next full fetch. A third latent
  bug found in the same review: dated topics sort first, so
  dateless topics were pushed under the collapsed "Past months"
  section. All three fixed here.
- HOME IS NOW TITLE LINES ONLY (no images anywhere on home):
  every section (Awaiting / Pending / Approved / Delivered) is a
  clean list of topic titles with type, version count, status and
  date. Click a title to open the topic.
- GROUP SECTION RULE (corrected): a topic's section follows its
  MOST ADVANCED version's status — if ANY version is approved,
  the whole topic moves to Approved (work complete); same for
  delivered. This is Bilal's rule: one approved version completes
  the script.
- CAROUSEL DETAIL: version NAME list first ("V1 — Topic", V1 on
  top, then in order) — no slide images yet. Clicking a name (or
  View) opens the IG-style lightbox for that version's slides
  (the viewer Bilal likes, with Approve / Download / Comment).
  Poster / Thumbnail / Cover details keep v2.4 version sections
  (image + per-slide downloads + per-version ZIP + Approve).
- PER-VERSION ZIP: every version carries its own Download ZIP
  button (carousel list lines and poster sections). The topic
  header shows "Download All as ZIP" ONLY when every version
  shares one identical ZIP (old jobs); mixed per-version ZIPs
  show per-version buttons only. The pakka prompt now requires
  one ZIP per version for all new jobs (no more shared ZIP).
- HISTORY MARKS (display-only, data never mutated): in an
  approved/completed topic, the winning version shows green
  "Approved ✓" and every other version shows soft-grey "Not
  selected" — NO cross, NO red, NO strikethrough; the design
  stays fully viewable and downloadable (the interview analogy:
  all candidates worked hard, one was selected, the record
  stays dignified). On home, approved topics carry a green ✓
  before the title plus a "V2 approved" sub-line.
- APPROVAL DATE SECTIONS + FILTER (history only): Approved and
  Delivered topics are sub-grouped by approval date (from
  Supabase job_status.updated_at; newest first; "Date not
  recorded" last when unknown) with a date filter above the
  history (pick a date, or All dates). The app now selects
  updated_at from Supabase for this.
- Dashboard strip now refreshes on every home render, so
  overlay approvals update it immediately.
- Bridge v3 (separate file, Apps Script — NOT in this repo):
  sends Bilal a detailed email per submission (approval /
  comment / new script) with topic, type, version, decision,
  text and time, because Google Forms' built-in notification
  never says what happened. The Form has no sign-in, so the
  email cannot say who pressed the button; it notes that if
  Bilal did not just press it, the client did. Updating the
  bridge needs a fresh MailApp authorization (run
  authorizeEmailOnce() once after pasting).
