const fs = require('fs');
const path = require('path');

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      redirect: 'follow'
    });

    const status = res.status;
    const finalUrl = res.url;

    if (status === 404) {
      return { ok: false, status, finalUrl, reason: `HTTP status 404 (Not Found)` };
    }

    // 403 Forbidden: usually Cloudflare/bot protection.
    // 429 Too Many Requests: rate limiting.
    // We treat these as likely valid rather than dead.
    if (status === 403) {
      return { ok: true, status, finalUrl, isWarning: true, reason: `HTTP status 403 (Scraper Protected / CF Blocked)` };
    }
    if (status === 429) {
      return { ok: true, status, finalUrl, isWarning: true, reason: `HTTP status 429 (Rate Limited)` };
    }

    if (status >= 400) {
      return { ok: false, status, finalUrl, reason: `HTTP status ${status}` };
    }

    // Read a portion of the text to look for "not found", "expired", etc.
    const text = await res.text();
    const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const lowerText = text.toLowerCase();
    const lowerTitle = title.toLowerCase();

    // Common indicators of expired/missing jobs
    const deadKeywords = [
      'job not found',
      'job is no longer available',
      'position is no longer available',
      'job posting has expired',
      'this job has expired',
      'listing has expired',
      'page not found',
      '404 not found',
      'error 404',
      'job is closed',
      'no longer accepting applications'
    ];

    for (const kw of deadKeywords) {
      if (lowerText.includes(kw) || lowerTitle.includes(kw)) {
        return { ok: false, status, finalUrl, title, reason: `Dead keyword detected: "${kw}"` };
      }
    }

    return { ok: true, status, finalUrl, title };
  } catch (e) {
    return { ok: false, status: 0, finalUrl: url, reason: `Fetch error: ${e.message}` };
  }
}

async function verifyAllUrls() {
  const jobsPath = path.join(__dirname, 'jobs.json');
  if (!fs.existsSync(jobsPath)) {
    console.error("jobs.json does not exist. Run aggregate_jobs.js first.");
    return;
  }

  const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf-8'));
  console.log(`Checking ${jobs.length} jobs with optimized validation logic...`);

  const results = [];
  let checked = 0;

  for (const job of jobs) {
    checked++;
    console.log(`[${checked}/${jobs.length}] Checking: ${job.title} at ${job.company} (${job.source})`);
    console.log(`  URL: ${job.url}`);
    
    // Quick delay to be gentle on servers
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const res = await checkUrl(job.url);
    if (res.ok) {
      if (res.isWarning) {
        console.log(`  ⚠️ OK with Warning: ${res.reason} (Status: ${res.status})`);
      } else {
        console.log(`  🟢 OK (Status: ${res.status}, Title: "${res.title || 'N/A'}")`);
      }
      results.push({ job, status: 'valid', info: res });
    } else {
      console.log(`  🔴 FAILED: ${res.reason} (Status: ${res.status}, Final URL: ${res.finalUrl})`);
      results.push({ job, status: 'invalid', info: res });
    }
  }

  console.log("\n==================================================");
  console.log("Verification Summary");
  console.log("==================================================");
  const valid = results.filter(r => r.status === 'valid');
  const invalid = results.filter(r => r.status === 'invalid');
  console.log(`Total Checked: ${results.length}`);
  console.log(`Valid: ${valid.length} (includes protected/rate-limited links)`);
  console.log(`Invalid (Definitely Dead): ${invalid.length}`);

  if (invalid.length > 0) {
    console.log("\nInvalid Jobs Details:");
    invalid.forEach(inv => {
      console.log(`- ${inv.job.title} at ${inv.job.company} (${inv.job.source})`);
      console.log(`  URL: ${inv.job.url}`);
      console.log(`  Reason: ${inv.info.reason}`);
    });
  }

  // Save the list of valid jobs back to the files to filter out the dead ones
  if (invalid.length > 0) {
    console.log(`\nFiltering out ${invalid.length} dead jobs and updating output files...`);
    const validJobs = valid.map(r => r.job);
    
    fs.writeFileSync(jobsPath, JSON.stringify(validJobs, null, 2), 'utf-8');
    fs.writeFileSync(path.join(__dirname, 'jobs_data.js'), 'window.jobsData = ' + JSON.stringify(validJobs, null, 2) + ';', 'utf-8');
    
    // Regenerate CSV
    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '';
      if (Array.isArray(val)) val = val.join(', ');
      let str = String(val).replace(/"/g, '""').replace(/\r/g, '').replace(/\n/g, ' ');
      if (str.includes(',') || str.includes('"') || str.includes(';')) {
        return `"${str}"`;
      }
      return str;
    };
    
    const csvHeaders = ['ID', 'Title', 'Company', 'Locations', 'Salary String', 'Min Salary', 'Max Salary', 'Source', 'URL', 'Publication Date', 'Category', 'Description'];
    const csvRows = [csvHeaders.join(',')];

    for (const job of validJobs) {
      const row = [
        escapeCSV(job.id),
        escapeCSV(job.title),
        escapeCSV(job.company),
        escapeCSV(job.locations),
        escapeCSV(job.salaryStr),
        job.minSalary,
        job.maxSalary,
        escapeCSV(job.source),
        escapeCSV(job.url),
        escapeCSV(job.date),
        escapeCSV(job.category),
        escapeCSV(job.description)
      ];
      csvRows.push(row.join(','));
    }

    fs.writeFileSync(path.join(__dirname, 'jobs.csv'), csvRows.join('\n'), 'utf-8');
    console.log(`Saved updated jobs database with ${validJobs.length} active listings.`);
  } else {
    console.log("\nNo dead jobs found. Database is fully up-to-date!");
  }
}

verifyAllUrls();
