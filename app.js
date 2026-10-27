/* ==========================================================================
   The Commons Institute — Client Design Gallery (app.js — v2 Update)
   ==========================================================================
   CONFIGURATION (Feature 8):
   Edit the values in APP_CONFIG below to connect your Google Form (for
   one-tap Approvals, Comments, and New Script submissions) and your
   Client Uploads Google Drive folder.
   - Leave placeholders as-is until your Form/Folder is ready; the app works
     smoothly in placeholder mode (confirming & copying to clipboard without
     errors).
   - See README.md for step-by-step instructions on finding your Google Form
     formResponse URL and entry.XXXXXXX field IDs.
   ========================================================================== */

var APP_CONFIG = {
  // Studio & Footer Branding
  studioName: "The Commons Institute",
  subtitle: "CSS / PMS Design Deliverables Portal",
  logo: "logo.png",
  footerText: "The Commons Institute • Bilal Bhullar",

  // Google Form endpoint URL (ends in /formResponse)
  // Set Google Form to: "Anyone with the link can respond", NO sign-in required, Email notifications ON.
  // Example: "https://docs.google.com/forms/d/e/1FAIpQLSdXXXXXXXXXXXXXXX/formResponse"
  formActionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSe10MPhkzAjCUjH9C_YXCpKh8h5HMcIil0EJEyY61gzm8WsPQ/formResponse",

  // Google Form field mapping (replace with your Form's entry.XXXXXXX IDs)
  formFields: {
    approval: {
      jobId: "entry.240418436",
      topic: "entry.1797275031",
      type: "entry.230484405",
      version: "entry.1648103189",
      decision: "entry.1211808544"
    },
    comment: {
      jobId: "entry.240418436",
      topic: "entry.1797275031",
      type: "entry.230484405",
      version: "entry.1648103189",
      comment: "entry.486198956",
      name: "entry.1003084440"
    },
    newScript: {
      script: "entry.486198956",
      comment: "entry.191806707"
    }
  },

  // Client Uploads Google Drive Folder URL (set folder sharing to "Anyone with the link" -> Editor/Contributor)
  // Example: "https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz"
  clientUploadsFolderUrl: "https://drive.google.com/drive/folders/1ird6Bz8Zz8zQ6hqHOktys0nms6BSaJHh",

  // Auto-refresh interval in milliseconds (5 minutes = 300000 ms)
  refreshIntervalMs: 300000
};

(function () {
  "use strict";

  // Fallback data matches jobs.json so opening index.html directly via file:// works seamlessly
  var FALLBACK_DATA = {
  "config": {
    "studioName": "The Commons Institute",
    "subtitle": "CSS / PMS Design Deliverables Portal",
    "logo": "https://drive.google.com/thumbnail?id=1UXUQy18al4R2d02jDxwlxAyABHR_nuCd&sz=w200",
    "footerText": "The Commons Institute • Bilal Bhullar"
  },
  "jobs": [
    {
      "id": "job-2026-10-27-monroe-donroe-v1",
      "date": "2026-10-27",
      "topic": "Monroe vs Donroe Doctrine",
      "type": "Carousel",
      "version": "V1",
      "status": "awaiting-approval",
      "slideCount": 6,
      "zipDownload": "https://drive.google.com/uc?export=download&id=1pa2e0arPoI2ryoCZKAlcNDuk-74HDCWT",
      "slides": [
        {
          "name": "Slide 01 — Cover: Monroe vs Donroe Doctrine",
          "thumb": "https://drive.google.com/thumbnail?id=19cyWQcXqbPe5HWbxwGvJdbmaIf3LWuLy&sz=w1000",
          "download": "https://drive.google.com/uc?export=download&id=19cyWQcXqbPe5HWbxwGvJdbmaIf3LWuLy"
        },
        {
          "name": "Slide 02 — The Monroe Doctrine (1823)",
          "thumb": "https://drive.google.com/thumbnail?id=1qmda-eN91e7_2fjD09jykKdauVWErLOV&sz=w1000",
          "download": "https://drive.google.com/uc?export=download&id=1qmda-eN91e7_2fjD09jykKdauVWErLOV"
        },
        {
          "name": "Slide 03 — The Donroe Doctrine",
          "thumb": "https://drive.google.com/thumbnail?id=1GFdgSODaYKvMry407K5Kp-0LkWaHm-U0&sz=w1000",
          "download": "https://drive.google.com/uc?export=download&id=1GFdgSODaYKvMry407K5Kp-0LkWaHm-U0"
        },
        {
          "name": "Slide 04 — Donroe in Action",
          "thumb": "https://drive.google.com/thumbnail?id=1tD9iC6ghPqVQ9D8mYiHhHorqtqR3NQWv&sz=w1000",
          "download": "https://drive.google.com/uc?export=download&id=1tD9iC6ghPqVQ9D8mYiHhHorqtqR3NQWv"
        },
        {
          "name": "Slide 05 — What Changed, What Continued",
          "thumb": "https://drive.google.com/thumbnail?id=1UAcqG0IEb2pV0xfFlcxgg0eFWNCVFF0F&sz=w1000",
          "download": "https://drive.google.com/uc?export=download&id=1UAcqG0IEb2pV0xfFlcxgg0eFWNCVFF0F"
        },
        {
          "name": "Slide 06 — Why Donroe Is Back in the Spotlight",
          "thumb": "https://drive.google.com/thumbnail?id=1D_gdPKxTO-TmXV5yberF133pbICysSZC&sz=w1000",
          "download": "https://drive.google.com/uc?export=download&id=1D_gdPKxTO-TmXV5yberF133pbICysSZC"
        }
      ]
    }
  ]
};

  var state = {
    config: Object.assign({}, APP_CONFIG),
    jobs: [],
    searchQuery: "",
    typeFilter: "All", // "All" | "Poster" | "Carousel"
    activeJobId: null,
    activeView: "home", // "home" | "job" | "script"
    lightboxJob: null,
    lightboxSlideIndex: 0,
    lastUpdatedText: ""
  };

  var els = {};
  var refreshTimerId = null;

  function cacheElements() {
    els.brandHomeLink = document.getElementById("brandHomeLink");
    els.brandLogo = document.getElementById("brandLogo");
    els.brandTitle = document.getElementById("brandTitle");
    els.brandSubtitle = document.getElementById("brandSubtitle");
    els.totalJobsPill = document.getElementById("totalJobsPill");
    els.updatedIndicator = document.getElementById("updatedIndicator");

    els.homeView = document.getElementById("homeView");
    els.jobView = document.getElementById("jobView");
    els.scriptView = document.getElementById("scriptView");

    els.dashboardStrip = document.getElementById("dashboardStrip");
    els.dashboardGrid = document.getElementById("dashboardGrid");

    els.searchInput = document.getElementById("searchInput");
    els.clearSearchBtn = document.getElementById("clearSearchBtn");
    els.filterBtns = document.querySelectorAll(".filter-btn");
    els.resultsSummary = document.getElementById("resultsSummary");
    els.openScriptViewBtn = document.getElementById("openScriptViewBtn");
    els.jobsGrid = document.getElementById("jobsGrid");

    els.backToGalleryBtn = document.getElementById("backToGalleryBtn");
    els.jobHeaderContainer = document.getElementById("jobHeaderContainer");
    els.slidesGrid = document.getElementById("slidesGrid");
    els.jobFeedbackContainer = document.getElementById("jobFeedbackContainer");

    els.backFromScriptBtn = document.getElementById("backFromScriptBtn");
    els.newScriptForm = document.getElementById("newScriptForm");
    els.newScriptText = document.getElementById("newScriptText");
    els.newScriptComment = document.getElementById("newScriptComment");
    els.newScriptFeedback = document.getElementById("newScriptFeedback");
    els.clientUploadsFolderBtn = document.getElementById("clientUploadsFolderBtn");
    els.clientUploadsFolderNote = document.getElementById("clientUploadsFolderNote");

    els.lightbox = document.getElementById("lightbox");
    els.lightboxCounter = document.getElementById("lightboxCounter");
    els.lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
    els.lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
    els.lightboxNextBtn = document.getElementById("lightboxNextBtn");
    els.lightboxImgContainer = document.getElementById("lightboxImgContainer");
    els.lightboxSlideTitle = document.getElementById("lightboxSlideTitle");
    els.lightboxSlideSub = document.getElementById("lightboxSlideSub");
    els.lightboxDownloadBtn = document.getElementById("lightboxDownloadBtn");

    els.footerCreditText = document.getElementById("footerCreditText");
  }

  // Format YYYY-MM-DD into readable date (e.g., "27 Oct 2026")
  function formatDate(dateStr) {
    if (!dateStr) return "";
    var parts = String(dateStr).split("-");
    if (parts.length !== 3) return dateStr;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var y = parts[0];
    var m = parseInt(parts[1], 10) - 1;
    var d = parseInt(parts[2], 10);
    if (isNaN(m) || m < 0 || m > 11 || isNaN(d)) return dateStr;
    return d + " " + months[m] + " " + y;
  }

  // Escape HTML to prevent XSS
  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Normalize job status (defaults to "awaiting-approval" for backward compatibility with v1)
  function getJobStatus(job) {
    var raw = String((job && job.status) || "awaiting-approval").trim().toLowerCase();
    if (raw === "pending" || raw === "awaiting-approval" || raw === "approved" || raw === "delivered") {
      return raw;
    }
    return "awaiting-approval";
  }

  function getStatusLabel(status) {
    if (status === "pending") return "Pending";
    if (status === "approved") return "Approved";
    if (status === "delivered") return "Delivered";
    return "Awaiting Approval";
  }

  function getStatusBadgeClass(status) {
    if (status === "pending") return "badge-status-pending";
    if (status === "approved") return "badge-status-approved";
    if (status === "delivered") return "badge-status-delivered";
    return "badge-status-awaiting";
  }

  // Check if a job date (YYYY-MM-DD) is less than 7 days old relative to current date (or newest job date if viewing sample in future/past)
  function isJobLatest(dateStr, referenceMs) {
    if (!dateStr) return false;
    var parts = String(dateStr).split("-");
    if (parts.length !== 3) return false;
    var jobTime = Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    if (isNaN(jobTime)) return false;
    var diffDays = (referenceMs - jobTime) / (1000 * 60 * 60 * 24);
    return diffDays >= -1 && diffDays < 7;
  }

  function getReferenceTimestamp() {
    var now = new Date();
    var nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return nowUtc;
  }

  function getYearMonth(dateStr) {
    if (!dateStr || String(dateStr).length < 7) return "";
    return String(dateStr).slice(0, 7); // "YYYY-MM"
  }

  // Update "Updated HH:MM" indicator (Feature 7)
  function markUpdatedNow() {
    var now = new Date();
    var hh = String(now.getHours()).padStart(2, "0");
    var mm = String(now.getMinutes()).padStart(2, "0");
    state.lastUpdatedText = "Updated " + hh + ":" + mm;
    if (els.updatedIndicator) {
      els.updatedIndicator.textContent = state.lastUpdatedText;
    }
  }

  // Copy text to clipboard with fallback for sandboxed iframes
  function copyTextToClipboard(text, callback) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (callback) callback(true);
      }).catch(function () {
        fallbackCopy(text, callback);
      });
    } else {
      fallbackCopy(text, callback);
    }
  }

  function fallbackCopy(text, callback) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      if (callback) callback(true);
    } catch (e) {
      if (callback) callback(false);
    }
  }

  // Check whether Google Form endpoint is configured or still a placeholder
  function isFormConfigured() {
    var url = String(state.config.formActionUrl || "").trim();
    return url.length > 0 && url.indexOf("PLACEHOLDER") === -1 && url.indexOf("http") === 0;
  }

  // Check whether Client Uploads Drive Folder URL is configured or still a placeholder
  function isUploadsFolderConfigured() {
    var url = String(state.config.clientUploadsFolderUrl || "").trim();
    return url.length > 0 && url.indexOf("PLACEHOLDER") === -1 && url.indexOf("http") === 0;
  }

  // Submit data to Google Form endpoint (no-cors POST so no Google sign-in or redirect page is shown)
  function submitToGoogleForm(fieldMap, valuesObj, doneCallback) {
    if (!isFormConfigured()) {
      if (doneCallback) doneCallback({ configured: false });
      return;
    }
    try {
      var formData = new URLSearchParams();
      for (var key in valuesObj) {
        if (Object.prototype.hasOwnProperty.call(valuesObj, key)) {
          var entryId = fieldMap && fieldMap[key];
          if (entryId && valuesObj[key] != null) {
            formData.append(entryId, String(valuesObj[key]));
          }
        }
      }
      fetch(state.config.formActionUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      }).then(function () {
        if (doneCallback) doneCallback({ configured: true });
      }).catch(function () {
        if (doneCallback) doneCallback({ configured: true });
      });
    } catch (e) {
      if (doneCallback) doneCallback({ configured: false });
    }
  }

  // Normalize jobs.json payload (supports either { config, jobs: [...] } or plain [...])
  function applyData(payload) {
    if (Array.isArray(payload)) {
      state.jobs = payload.slice();
    } else if (payload && typeof payload === "object") {
      if (payload.config) {
        state.config = Object.assign({}, APP_CONFIG, payload.config);
      }
      state.jobs = Array.isArray(payload.jobs) ? payload.jobs.slice() : [];
    }

    // Sort newest first by date (YYYY-MM-DD descending)
    state.jobs.sort(function (a, b) {
      var dateA = String(a.date || "");
      var dateB = String(b.date || "");
      return dateB.localeCompare(dateA);
    });

    // Apply header & footer branding from config
    if (els.brandTitle && state.config.studioName) {
      els.brandTitle.textContent = state.config.studioName;
      document.title = state.config.studioName + " — Client Design Gallery";
    }
    if (els.brandSubtitle && state.config.subtitle) {
      els.brandSubtitle.textContent = state.config.subtitle;
    }
    if (els.brandLogo && state.config.logo) {
      els.brandLogo.setAttribute("src", state.config.logo);
    }
    if (els.footerCreditText) {
      els.footerCreditText.textContent = state.config.footerText || "The Commons Institute • Bilal Bhullar";
    }
    if (els.totalJobsPill) {
      var count = state.jobs.length;
      els.totalJobsPill.textContent = count + (count === 1 ? " Deliverable" : " Deliverables");
    }

    // Configure Client Uploads folder button in Submit New Script view
    if (els.clientUploadsFolderBtn) {
      if (isUploadsFolderConfigured()) {
        els.clientUploadsFolderBtn.setAttribute("href", state.config.clientUploadsFolderUrl);
        els.clientUploadsFolderBtn.removeAttribute("data-placeholder-folder");
      } else {
        els.clientUploadsFolderBtn.setAttribute("href", "#scriptView");
        els.clientUploadsFolderBtn.setAttribute("data-placeholder-folder", "true");
      }
    }

    markUpdatedNow();
    renderDashboardStrip();
  }

  // Feature 2: Compute and render Live Dashboard Strip from jobs.json
  function renderDashboardStrip() {
    if (!els.dashboardGrid) return;
    var totalDesigns = state.jobs.length;
    var totalSlides = 0;
    var posters = 0;
    var carousels = 0;
    var awaitingApproval = 0;
    var pending = 0;
    var approved = 0;
    var delivered = 0;

    for (var i = 0; i < state.jobs.length; i++) {
      var job = state.jobs[i];
      var slidesArr = Array.isArray(job.slides) ? job.slides : [];
      var sCount = Number(job.slideCount) || slidesArr.length || 1;
      totalSlides += sCount;

      var t = String(job.type || "").toLowerCase();
      if (t === "carousel") carousels++;
      else posters++;

      var st = getJobStatus(job);
      if (st === "pending") pending++;
      else if (st === "approved") approved++;
      else if (st === "delivered") delivered++;
      else awaitingApproval++;
    }

    var metrics = [
      { label: "Total Designs", value: totalDesigns, cls: "" },
      { label: "Total Slides", value: totalSlides, cls: "" },
      { label: "Posters", value: posters, cls: "" },
      { label: "Carousels", value: carousels, cls: "" },
      { label: "Awaiting Approval", value: awaitingApproval, cls: "highlight-awaiting" },
      { label: "Pending", value: pending, cls: "" },
      { label: "Approved", value: approved, cls: "highlight-approved" },
      { label: "Delivered", value: delivered, cls: "" }
    ];

    var html = "";
    for (var m = 0; m < metrics.length; m++) {
      var item = metrics[m];
      html +=
        '<div class="dash-stat-card ' + item.cls + '">' +
          '<span class="dash-stat-value">' + item.value + '</span>' +
          '<span class="dash-stat-label">' + escapeHtml(item.label) + '</span>' +
        '</div>';
    }
    els.dashboardGrid.innerHTML = html;
  }

  // Build a clean fallback placeholder DOM element when a Drive link is a sample or unavailable
  function createFallbackPlaceholder(slideLabel, isSample) {
    var wrap = document.createElement("div");
    wrap.className = "img-fallback";
    wrap.innerHTML =
      '<div class="img-fallback-icon">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>' +
          '<circle cx="8.5" cy="8.5" r="1.5"></circle>' +
          '<polyline points="21 15 16 10 5 21"></polyline>' +
        '</svg>' +
      '</div>' +
      '<div class="img-fallback-title">Image unavailable</div>' +
      '<div class="img-fallback-sub">' +
        escapeHtml(slideLabel || (isSample ? "Sample Drive ID — replace with real Google Drive File ID in jobs.json" : "Preview could not be loaded from Google Drive")) +
      '</div>';
    return wrap;
  }

  // Attach resilient image error handler so broken/sample Drive links never break layout
  function wireImageFallbacks(container) {
    if (!container) return;
    var imgs = container.querySelectorAll("img[data-drive-img]");
    for (var i = 0; i < imgs.length; i++) {
      (function (img) {
        img.addEventListener("error", function () {
          if (img.dataset.fallbackApplied) return;
          img.dataset.fallbackApplied = "true";
          var label = img.getAttribute("data-label") || "";
          var isSample = (img.getAttribute("src") || "").indexOf("1Sample_") !== -1;
          var fallbackEl = createFallbackPlaceholder(label, isSample);
          if (img.parentNode) {
            img.parentNode.replaceChild(fallbackEl, img);
          }
        });
      })(imgs[i]);
    }
  }

  // Filter jobs based on search query and type filter
  function getFilteredJobs() {
    var q = state.searchQuery.trim().toLowerCase();
    var t = state.typeFilter;
    return state.jobs.filter(function (job) {
      var matchesType = t === "All" || String(job.type || "").toLowerCase() === t.toLowerCase();
      var matchesSearch = !q || String(job.topic || "").toLowerCase().indexOf(q) !== -1;
      return matchesType && matchesSearch;
    });
  }

  // Build a single job card HTML (used in Awaiting Approval and Pending sections)
  function buildJobCardHtml(job, refMs) {
    var slides = Array.isArray(job.slides) ? job.slides : [];
    var slideCount = job.slideCount || slides.length || 1;
    var slideText = slideCount === 1 ? "1 slide" : slideCount + " slides";
    var firstSlide = slides[0] || { thumb: "", download: "", name: job.topic };
    var isCarousel = String(job.type || "").toLowerCase() === "carousel";
    var badgeClass = isCarousel ? "badge-carousel" : "badge-poster";
    var status = getJobStatus(job);
    var statusLabel = getStatusLabel(status);
    var statusBadgeClass = getStatusBadgeClass(status);
    var latestBadgeHtml = isJobLatest(job.date, refMs)
      ? '<span class="badge badge-latest">Latest</span>'
      : "";

    return (
      '<article class="job-card" data-job-id="' + escapeHtml(job.id) + '">' +
        '<div class="card-thumb-wrap" data-action="open-job" data-job-id="' + escapeHtml(job.id) + '">' +
          '<div class="card-floating-badges">' +
            '<div class="badge-group">' +
              '<span class="badge ' + badgeClass + '">' + escapeHtml(job.type || "Poster") + '</span>' +
              '<span class="badge badge-version">' + escapeHtml(job.version || "V1") + '</span>' +
              latestBadgeHtml +
            '</div>' +
            '<span class="badge badge-slides">' + escapeHtml(slideText) + '</span>' +
          '</div>' +
          '<img class="card-thumb-img" loading="lazy" data-drive-img="true" ' +
            'src="' + escapeHtml(firstSlide.thumb) + '" ' +
            'alt="' + escapeHtml(job.topic) + '" ' +
            'data-label="' + escapeHtml(firstSlide.name || job.topic) + '" />' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-meta-row">' +
            '<span class="card-date">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>' +
                '<line x1="16" y1="2" x2="16" y2="6"></line>' +
                '<line x1="8" y1="2" x2="8" y2="6"></line>' +
                '<line x1="3" y1="10" x2="21" y2="10"></line>' +
              '</svg>' +
              escapeHtml(formatDate(job.date)) +
            '</span>' +
            '<span class="badge ' + statusBadgeClass + '">' + escapeHtml(statusLabel) + '</span>' +
          '</div>' +
          '<h2 class="card-topic" data-action="open-job" data-job-id="' + escapeHtml(job.id) + '">' +
            escapeHtml(job.topic) +
          '</h2>' +
          '<div class="card-actions">' +
            '<button type="button" class="btn btn-primary" data-action="open-job" data-job-id="' + escapeHtml(job.id) + '">' +
              '<span>View + Download</span>' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">' +
                '<line x1="5" y1="12" x2="19" y2="12"></line>' +
                '<polyline points="12 5 19 12 12 19"></polyline>' +
              '</svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  // Build compact list HTML (used in Approved & Delivered sections — job names only, newest first)
  function buildCompactListHtml(jobsList, refMs) {
    var itemsHtml = "";
    for (var i = 0; i < jobsList.length; i++) {
      var job = jobsList[i];
      var latestHtml = isJobLatest(job.date, refMs)
        ? '<span class="badge badge-latest">Latest</span>'
        : "";
      itemsHtml +=
        '<li class="compact-job-item">' +
          '<button type="button" class="compact-job-btn" data-action="open-job" data-job-id="' + escapeHtml(job.id) + '">' +
            '<span class="compact-job-name-wrap">' +
              '<span class="compact-job-name">' + escapeHtml(job.topic) + '</span>' +
              latestHtml +
            '</span>' +
            '<span class="compact-job-arrow" aria-hidden="true">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">' +
                '<polyline points="9 18 15 12 9 6"></polyline>' +
              '</svg>' +
            '</span>' +
          '</button>' +
        '</li>';
    }
    return '<ul class="compact-job-list">' + itemsHtml + '</ul>';
  }

  // Render the 4 ordered status sections for a given subset of jobs
  // Exact order required: (a) Awaiting approval, (b) Pending, (c) Approved — compact list, job names only, (d) Delivered — compact list, job names only
  function buildFourSectionsHtml(jobsList, refMs, showEmptySections) {
    var awaitingList = [];
    var pendingList = [];
    var approvedList = [];
    var deliveredList = [];

    for (var i = 0; i < jobsList.length; i++) {
      var j = jobsList[i];
      var st = getJobStatus(j);
      if (st === "pending") pendingList.push(j);
      else if (st === "approved") approvedList.push(j);
      else if (st === "delivered") deliveredList.push(j);
      else awaitingList.push(j);
    }

    var sections = [
      {
        key: "awaiting-approval",
        title: "Awaiting Approval",
        list: awaitingList,
        compact: false
      },
      {
        key: "pending",
        title: "Pending",
        list: pendingList,
        compact: false
      },
      {
        key: "approved",
        title: "Approved",
        list: approvedList,
        compact: true
      },
      {
        key: "delivered",
        title: "Delivered",
        list: deliveredList,
        compact: true
      }
    ];

    var html = '<div class="sections-stack">';
    for (var s = 0; s < sections.length; s++) {
      var sec = sections[s];
      if (!showEmptySections && sec.list.length === 0) continue;

      html +=
        '<section class="status-section" data-section-status="' + sec.key + '">' +
          '<div class="section-header-bar">' +
            '<h2 class="section-heading">' + escapeHtml(sec.title) + '</h2>' +
            '<span class="section-count-badge">' + sec.list.length + '</span>' +
          '</div>';

      if (sec.list.length === 0) {
        html +=
          '<div class="empty-state" style="padding: 1rem;">' +
            '<p style="font-size: 0.84rem;">No jobs currently in ' + escapeHtml(sec.title) + '.</p>' +
          '</div>';
      } else if (sec.compact) {
        html += buildCompactListHtml(sec.list, refMs);
      } else {
        var cardsHtml = "";
        for (var c = 0; c < sec.list.length; c++) {
          cardsHtml += buildJobCardHtml(sec.list[c], refMs);
        }
        html += '<div class="jobs-grid">' + cardsHtml + '</div>';
      }

      html += '</section>';
    }
    html += '</div>';
    return html;
  }

  // Render Home View (Organized Sections + Collapsible Past Months)
  function renderHome() {
    var filtered = getFilteredJobs();
    var total = state.jobs.length;

    if (els.clearSearchBtn) {
      els.clearSearchBtn.style.display = state.searchQuery.length > 0 ? "inline-flex" : "none";
    }

    if (els.resultsSummary) {
      if (state.searchQuery || state.typeFilter !== "All") {
        els.resultsSummary.textContent = "Showing " + filtered.length + " of " + total + " jobs";
      } else {
        els.resultsSummary.textContent = "Showing all " + total + " jobs (newest first)";
      }
    }

    if (filtered.length === 0) {
      els.jobsGrid.className = "";
      els.jobsGrid.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state-title">No matching designs found</div>' +
          '<p>Try clearing your search or switching the type filter to "All".</p>' +
        '</div>';
      return;
    }

    var refMs = getReferenceTimestamp();

    // Determine active month (the YYYY-MM of the newest job) so older months collapse cleanly under "Past months"
    var newestMonth = getYearMonth(filtered[0] && filtered[0].date);
    var currentMonthJobs = [];
    var pastMonthsJobs = [];

    for (var i = 0; i < filtered.length; i++) {
      var ym = getYearMonth(filtered[i].date);
      if (!newestMonth || ym === newestMonth) {
        currentMonthJobs.push(filtered[i]);
      } else {
        pastMonthsJobs.push(filtered[i]);
      }
    }

    var outHtml = buildFourSectionsHtml(currentMonthJobs, refMs, true);

    if (pastMonthsJobs.length > 0) {
      outHtml +=
        '<details class="past-months-details" style="margin-top: 1.5rem;">' +
          '<summary class="past-months-summary">' +
            '<span>Past months (' + pastMonthsJobs.length + (pastMonthsJobs.length === 1 ? ' older job' : ' older jobs') + ')</span>' +
            '<span style="font-size: 0.8rem; color: var(--text-muted);">Tap to expand</span>' +
          '</summary>' +
          '<div class="past-months-body">' +
            buildFourSectionsHtml(pastMonthsJobs, refMs, false) +
          '</div>' +
        '</details>';
    }

    els.jobsGrid.className = "";
    els.jobsGrid.innerHTML = outHtml;
    wireImageFallbacks(els.jobsGrid);
  }

  // Open a specific job's detail view (with Approve button + Comment box)
  function openJobView(jobId) {
    var job = null;
    for (var i = 0; i < state.jobs.length; i++) {
      if (String(state.jobs[i].id) === String(jobId)) {
        job = state.jobs[i];
        break;
      }
    }
    if (!job) return;

    state.activeJobId = job.id;
    state.activeView = "job";
    els.homeView.hidden = true;
    if (els.scriptView) els.scriptView.hidden = true;
    els.jobView.hidden = false;

    var slides = Array.isArray(job.slides) ? job.slides : [];
    var slideCount = job.slideCount || slides.length || 1;
    var slideText = slideCount === 1 ? "1 slide" : slideCount + " slides";
    var isCarousel = String(job.type || "").toLowerCase() === "carousel";
    var badgeClass = isCarousel ? "badge-carousel" : "badge-poster";
    var status = getJobStatus(job);
    var statusLabel = getStatusLabel(status);
    var statusBadgeClass = getStatusBadgeClass(status);
    var refMs = getReferenceTimestamp();
    var latestBadgeHtml = isJobLatest(job.date, refMs)
      ? '<span class="badge badge-latest">Latest</span>'
      : "";

    var zipButtonHtml = "";
    if (job.zipDownload) {
      zipButtonHtml =
        '<a class="btn btn-outline" href="' + escapeHtml(job.zipDownload) + '" target="_blank" rel="noopener noreferrer" download>' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>' +
            '<polyline points="7 10 12 15 17 10"></polyline>' +
            '<line x1="12" y1="15" x2="12" y2="3"></line>' +
          '</svg>' +
          '<span>Download All as ZIP</span>' +
        '</a>';
    }

    els.jobHeaderContainer.innerHTML =
      '<div class="job-detail-header">' +
        '<div class="job-detail-badges">' +
          '<span class="badge ' + badgeClass + '">' + escapeHtml(job.type || "Poster") + '</span>' +
          '<span class="badge badge-version">' + escapeHtml(job.version || "V1") + '</span>' +
          '<span class="badge badge-slides">' + escapeHtml(slideText) + '</span>' +
          '<span class="badge ' + statusBadgeClass + '">' + escapeHtml(statusLabel) + '</span>' +
          latestBadgeHtml +
        '</div>' +
        '<h1 class="job-detail-title">' + escapeHtml(job.topic) + '</h1>' +
        '<div class="job-detail-meta">' +
          '<span><strong>Date:</strong> ' + escapeHtml(formatDate(job.date)) + ' (' + escapeHtml(job.date) + ')</span>' +
          '<span>Tap any slide to inspect full screen or download original HD quality</span>' +
        '</div>' +
        '<div class="job-detail-actions-row">' +
          '<button type="button" id="approveJobBtn" class="btn btn-green" data-action="approve-job" data-job-id="' + escapeHtml(job.id) + '">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">' +
              '<polyline points="20 6 9 17 4 12"></polyline>' +
            '</svg>' +
            '<span>Approve Design</span>' +
          '</button>' +
          zipButtonHtml +
        '</div>' +
        '<div id="approveFeedbackBanner" hidden></div>' +
      '</div>';

    var slidesHtml = "";
    for (var s = 0; s < slides.length; s++) {
      var slide = slides[s];
      var numLabel = "Slide " + (s + 1) + " of " + slides.length;
      slidesHtml +=
        '<div class="slide-card">' +
          '<div class="slide-thumb-wrap" data-action="open-lightbox" data-slide-index="' + s + '">' +
            '<span class="slide-number-pill">' + escapeHtml(numLabel) + '</span>' +
            '<span class="slide-zoom-hint">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">' +
                '<circle cx="11" cy="11" r="8"></circle>' +
                '<line x1="21" y1="21" x2="16.65" y2="16.65"></line>' +
                '<line x1="11" y1="8" x2="11" y2="14"></line>' +
                '<line x1="8" y1="11" x2="14" y2="11"></line>' +
              '</svg>' +
              'Tap to View' +
            '</span>' +
            '<img class="card-thumb-img" loading="lazy" data-drive-img="true" ' +
              'src="' + escapeHtml(slide.thumb) + '" ' +
              'alt="' + escapeHtml(slide.name) + '" ' +
              'data-label="' + escapeHtml(slide.name) + '" />' +
          '</div>' +
          '<div class="slide-info">' +
            '<div class="slide-name">' + escapeHtml(slide.name) + '</div>' +
            '<div class="slide-actions">' +
              '<button type="button" class="btn btn-outline" style="flex:1;" data-action="open-lightbox" data-slide-index="' + s + '">' +
                'Full Screen' +
              '</button>' +
              '<a class="btn btn-maroon" style="flex:1;" href="' + escapeHtml(slide.download) + '" target="_blank" rel="noopener noreferrer" download>' +
                '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">' +
                  '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>' +
                  '<polyline points="7 10 12 15 17 10"></polyline>' +
                  '<line x1="12" y1="15" x2="12" y2="3"></line>' +
                '</svg>' +
                '<span>Download HD</span>' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    els.slidesGrid.innerHTML = slidesHtml;
    wireImageFallbacks(els.slidesGrid);

    // Feature 5: Render Comment Box for this job
    if (els.jobFeedbackContainer) {
      els.jobFeedbackContainer.innerHTML =
        '<div class="panel-card">' +
          '<h2 class="panel-title">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">' +
              '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' +
            '</svg>' +
            '<span>Leave a Revision Note or Comment</span>' +
          '</h2>' +
          '<p class="panel-desc">Send feedback on <strong>' + escapeHtml(job.topic) + ' (' + escapeHtml(job.version || "V1") + ')</strong>. No login required.</p>' +
          '<form id="jobCommentForm" data-job-id="' + escapeHtml(job.id) + '" novalidate>' +
            '<div class="form-group" style="margin-bottom: 0.75rem;">' +
              '<label class="form-label" for="commentAuthorInput">Your Name (optional)</label>' +
              '<input type="text" id="commentAuthorInput" class="form-input" placeholder="e.g., Faculty Member / Reviewer" />' +
            '</div>' +
            '<div class="form-group" style="margin-bottom: 0.85rem;">' +
              '<label class="form-label" for="commentBodyInput">Comment / Revision Notes *</label>' +
              '<textarea id="commentBodyInput" class="form-textarea" placeholder="Write your feedback or requested changes for this design..."></textarea>' +
            '</div>' +
            '<button type="submit" id="submitCommentBtn" class="btn btn-primary">' +
              '<span>Submit Comment</span>' +
            '</button>' +
          '</form>' +
          '<div id="commentFeedbackBanner" hidden></div>' +
        '</div>';
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Handle Feature 4: Approve button tap in Job View
  function handleApproveJob(jobId) {
    var job = null;
    for (var i = 0; i < state.jobs.length; i++) {
      if (String(state.jobs[i].id) === String(jobId)) {
        job = state.jobs[i];
        break;
      }
    }
    if (!job) return;

    var timestamp = new Date().toISOString();
    var copySummary = "Approved: " + job.topic + " - " + (job.type || "Poster") + " - " + (job.version || "V1");

    submitToGoogleForm(
      state.config.formFields && state.config.formFields.approval,
      {
        jobId: job.id,
        topic: job.topic,
        type: job.type || "Poster",
        version: job.version || "V1",
        decision: "approved",
        timestamp: timestamp
      },
      function (res) {
        copyTextToClipboard(copySummary, function () {
          var banner = document.getElementById("approveFeedbackBanner");
          if (!banner) return;
          var placeholderNote = (!res || !res.configured)
            ? '<div style="font-size: 0.8rem; color: var(--amber-warn); margin-top: 0.25rem;">Note: recording will activate once the Form is connected.</div>'
            : '';
          banner.className = "feedback-banner success";
          banner.hidden = false;
          banner.innerHTML =
            '<div><strong>Approval recorded — thank you</strong></div>' +
            '<div>Copied to clipboard: <span class="copied-snippet-box">' + escapeHtml(copySummary) + '</span></div>' +
            '<div>Paste it in the client group if you wish.</div>' +
            placeholderNote;
        });
      }
    );
  }

  // Handle Feature 5: Comment form submit in Job View
  function handleCommentSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var jobId = form.getAttribute("data-job-id");
    var job = null;
    for (var i = 0; i < state.jobs.length; i++) {
      if (String(state.jobs[i].id) === String(jobId)) {
        job = state.jobs[i];
        break;
      }
    }
    if (!job) return;

    var nameInput = document.getElementById("commentAuthorInput");
    var bodyInput = document.getElementById("commentBodyInput");
    var banner = document.getElementById("commentFeedbackBanner");
    var authorName = nameInput ? nameInput.value.trim() : "";
    var commentText = bodyInput ? bodyInput.value.trim() : "";

    if (!commentText) {
      if (banner) {
        banner.className = "feedback-banner warning";
        banner.hidden = false;
        banner.innerHTML = '<div>Please enter a comment before submitting.</div>';
      }
      if (bodyInput) bodyInput.focus();
      return;
    }

    var timestamp = new Date().toISOString();
    var copySummary = "Comment on " + job.topic + " - " + (job.version || "V1") + ": " + commentText;

    submitToGoogleForm(
      state.config.formFields && state.config.formFields.comment,
      {
        jobId: job.id,
        topic: job.topic,
        type: job.type || "Poster",
        version: job.version || "V1",
        comment: commentText,
        name: authorName,
        timestamp: timestamp
      },
      function (res) {
        copyTextToClipboard(copySummary, function () {
          if (bodyInput) bodyInput.value = "";
          if (!banner) return;
          var placeholderNote = (!res || !res.configured)
            ? '<div style="font-size: 0.8rem; color: var(--amber-warn); margin-top: 0.25rem;">Note: recording will activate once the Form is connected.</div>'
            : '';
          banner.className = "feedback-banner success";
          banner.hidden = false;
          banner.innerHTML =
            '<div><strong>Comment submitted — thank you</strong></div>' +
            '<div>Copied to clipboard: <span class="copied-snippet-box">' + escapeHtml(copySummary) + '</span></div>' +
            '<div>Paste it in the client group if you wish.</div>' +
            placeholderNote;
        });
      }
    );
  }

  // Feature 6: Open "Submit New Script" View
  function openScriptView() {
    state.activeJobId = null;
    state.activeView = "script";
    els.homeView.hidden = true;
    els.jobView.hidden = true;
    if (els.scriptView) els.scriptView.hidden = false;
    if (els.newScriptFeedback) els.newScriptFeedback.hidden = true;
    if (els.clientUploadsFolderNote) els.clientUploadsFolderNote.hidden = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Handle Feature 6: Submit New Script Form
  function handleNewScriptSubmit(e) {
    e.preventDefault();
    var scriptVal = els.newScriptText ? els.newScriptText.value.trim() : "";
    var commentVal = els.newScriptComment ? els.newScriptComment.value.trim() : "";
    var banner = els.newScriptFeedback;

    if (!scriptVal) {
      if (banner) {
        banner.className = "feedback-banner warning";
        banner.hidden = false;
        banner.innerHTML = '<div>Please enter the script text before submitting.</div>';
      }
      if (els.newScriptText) els.newScriptText.focus();
      return;
    }

    var timestamp = new Date().toISOString();
    var copySummary = "New Script: " + scriptVal + (commentVal ? " (Comment: " + commentVal + ")" : "");

    submitToGoogleForm(
      state.config.formFields && state.config.formFields.newScript,
      {
        script: scriptVal,
        comment: commentVal,
        timestamp: timestamp
      },
      function (res) {
        copyTextToClipboard(copySummary, function () {
          if (els.newScriptText) els.newScriptText.value = "";
          if (els.newScriptComment) els.newScriptComment.value = "";
          if (!banner) return;
          var placeholderNote = (!res || !res.configured)
            ? '<div style="font-size: 0.8rem; color: var(--amber-warn); margin-top: 0.25rem;">Note: recording will activate once the Form is connected.</div>'
            : '';
          banner.className = "feedback-banner success";
          banner.hidden = false;
          banner.innerHTML =
            '<div><strong>New script submitted — thank you</strong></div>' +
            '<div>Copied to clipboard: <span class="copied-snippet-box">' + escapeHtml(copySummary) + '</span></div>' +
            '<div>Paste it in the client group if you wish.</div>' +
            placeholderNote;
        });
      }
    );
  }

  function closeJobView() {
    state.activeJobId = null;
    state.activeView = "home";
    els.jobView.hidden = true;
    if (els.scriptView) els.scriptView.hidden = true;
    els.homeView.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Lightbox (Full-Screen Slide Viewer)
  function openLightbox(slideIndex) {
    if (!state.activeJobId) return;
    var job = null;
    for (var i = 0; i < state.jobs.length; i++) {
      if (String(state.jobs[i].id) === String(state.activeJobId)) {
        job = state.jobs[i];
        break;
      }
    }
    if (!job || !Array.isArray(job.slides) || job.slides.length === 0) return;

    state.lightboxJob = job;
    state.lightboxSlideIndex = Math.max(0, Math.min(slideIndex, job.slides.length - 1));
    els.lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    renderLightboxSlide();
  }

  function renderLightboxSlide() {
    var job = state.lightboxJob;
    if (!job) return;
    var slides = job.slides;
    var idx = state.lightboxSlideIndex;
    var slide = slides[idx];
    if (!slide) return;

    els.lightboxCounter.textContent = "Slide " + (idx + 1) + " of " + slides.length;
    els.lightboxSlideTitle.textContent = slide.name || ("Slide " + (idx + 1));
    els.lightboxSlideSub.textContent = job.topic + " • " + job.type + " (" + job.version + ")";
    els.lightboxDownloadBtn.setAttribute("href", slide.download);

    els.lightboxPrevBtn.style.display = slides.length > 1 ? "inline-flex" : "none";
    els.lightboxNextBtn.style.display = slides.length > 1 ? "inline-flex" : "none";

    // High-res preview uses larger thumbnail parameter (sz=w2000) while Download HD fetches the raw original uc?export=download file
    var highResPreviewUrl = String(slide.thumb || "").replace(/sz=w\d+/i, "sz=w2000");
    els.lightboxImgContainer.innerHTML =
      '<img class="lightbox-img" data-drive-img="true" ' +
        'src="' + escapeHtml(highResPreviewUrl) + '" ' +
        'alt="' + escapeHtml(slide.name) + '" ' +
        'data-label="' + escapeHtml(slide.name) + '" />';
    wireImageFallbacks(els.lightboxImgContainer);
  }

  function stepLightbox(delta) {
    if (!state.lightboxJob || !Array.isArray(state.lightboxJob.slides)) return;
    var len = state.lightboxJob.slides.length;
    if (len <= 1) return;
    state.lightboxSlideIndex = (state.lightboxSlideIndex + delta + len) % len;
    renderLightboxSlide();
  }

  function closeLightbox() {
    els.lightbox.hidden = true;
    state.lightboxJob = null;
    document.body.style.overflow = "";
  }

  // Event Listeners
  function bindEvents() {
    if (els.brandHomeLink) {
      els.brandHomeLink.addEventListener("click", function (e) {
        e.preventDefault();
        closeLightbox();
        closeJobView();
      });
    }

    if (els.searchInput) {
      els.searchInput.addEventListener("input", function (e) {
        state.searchQuery = e.target.value || "";
        renderHome();
      });
    }

    if (els.clearSearchBtn) {
      els.clearSearchBtn.addEventListener("click", function () {
        state.searchQuery = "";
        if (els.searchInput) els.searchInput.value = "";
        renderHome();
      });
    }

    for (var i = 0; i < els.filterBtns.length; i++) {
      els.filterBtns[i].addEventListener("click", function (e) {
        var btn = e.currentTarget;
        var filterType = btn.getAttribute("data-filter") || "All";
        state.typeFilter = filterType;
        for (var j = 0; j < els.filterBtns.length; j++) {
          els.filterBtns[j].classList.toggle("active", els.filterBtns[j] === btn);
        }
        renderHome();
      });
    }

    if (els.openScriptViewBtn) {
      els.openScriptViewBtn.addEventListener("click", function () {
        openScriptView();
      });
    }

    if (els.backFromScriptBtn) {
      els.backFromScriptBtn.addEventListener("click", function () {
        closeJobView();
      });
    }

    if (els.newScriptForm) {
      els.newScriptForm.addEventListener("submit", handleNewScriptSubmit);
    }

    if (els.clientUploadsFolderBtn) {
      els.clientUploadsFolderBtn.addEventListener("click", function (e) {
        if (els.clientUploadsFolderBtn.getAttribute("data-placeholder-folder") === "true") {
          e.preventDefault();
          if (els.clientUploadsFolderNote) {
            els.clientUploadsFolderNote.hidden = false;
            els.clientUploadsFolderNote.className = "feedback-banner warning";
            els.clientUploadsFolderNote.innerHTML =
              '<div><strong>Client Uploads Drive folder link will activate once connected in <code>app.js</code> (<code>APP_CONFIG.clientUploadsFolderUrl</code>).</strong> Meanwhile, you can send original images as WhatsApp documents (full quality).</div>';
          }
        }
      });
    }

    if (els.jobsGrid) {
      els.jobsGrid.addEventListener("click", function (e) {
        var target = e.target.closest("[data-action='open-job']");
        if (target) {
          var jobId = target.getAttribute("data-job-id");
          openJobView(jobId);
        }
      });
    }

    if (els.backToGalleryBtn) {
      els.backToGalleryBtn.addEventListener("click", function () {
        closeJobView();
      });
    }

    if (els.jobHeaderContainer) {
      els.jobHeaderContainer.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-action='approve-job']");
        if (btn) {
          handleApproveJob(btn.getAttribute("data-job-id"));
        }
      });
    }

    if (els.jobFeedbackContainer) {
      els.jobFeedbackContainer.addEventListener("submit", function (e) {
        if (e.target && e.target.id === "jobCommentForm") {
          handleCommentSubmit(e);
        }
      });
    }

    if (els.slidesGrid) {
      els.slidesGrid.addEventListener("click", function (e) {
        var target = e.target.closest("[data-action='open-lightbox']");
        if (target) {
          var idx = parseInt(target.getAttribute("data-slide-index"), 10) || 0;
          openLightbox(idx);
        }
      });
    }

    if (els.lightboxCloseBtn) {
      els.lightboxCloseBtn.addEventListener("click", closeLightbox);
    }
    if (els.lightboxPrevBtn) {
      els.lightboxPrevBtn.addEventListener("click", function () {
        stepLightbox(-1);
      });
    }
    if (els.lightboxNextBtn) {
      els.lightboxNextBtn.addEventListener("click", function () {
        stepLightbox(1);
      });
    }

    if (els.lightbox) {
      els.lightbox.addEventListener("click", function (e) {
        if (e.target === els.lightbox || e.target === els.lightboxImgContainer) {
          closeLightbox();
        }
      });
    }

    document.addEventListener("keydown", function (e) {
      if (els.lightbox && !els.lightbox.hidden) {
        if (e.key === "Escape") closeLightbox();
        else if (e.key === "ArrowLeft") stepLightbox(-1);
        else if (e.key === "ArrowRight") stepLightbox(1);
      }
    });

    // Feature 7: Re-fetch jobs.json whenever the tab regains focus or visibility
    window.addEventListener("focus", function () {
      fetchJobsData(false);
    });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        fetchJobsData(false);
      }
    });
  }

  // Fetch jobs.json and refresh UI (Feature 7)
  function fetchJobsData(isInitial) {
    fetch("jobs.json?_t=" + Date.now(), { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        applyData(data);
        if (state.activeView === "home" || isInitial) {
          renderHome();
        }
      })
      .catch(function () {
        if (isInitial) {
          applyData(FALLBACK_DATA);
          renderHome();
        } else {
          markUpdatedNow();
        }
      });
  }

  // Initialize App & Auto-Refresh Timer (every 5 minutes)
  function init() {
    cacheElements();
    bindEvents();
    fetchJobsData(true);

    if (refreshTimerId) clearInterval(refreshTimerId);
    refreshTimerId = setInterval(function () {
      fetchJobsData(false);
    }, APP_CONFIG.refreshIntervalMs || 300000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
