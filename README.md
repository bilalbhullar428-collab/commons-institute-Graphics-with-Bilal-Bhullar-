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
