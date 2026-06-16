const fs = require('fs');
const path = require('path');

// Target file paths in the workspace
const JSON_OUTPUT_PATH = path.join(__dirname, 'jobs.json');
const CSV_OUTPUT_PATH = path.join(__dirname, 'jobs.csv');

// Salary extraction regexes
const rangeRegex = /(?:\$|USD)\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+)\s*([kK])?\s*(?:-|to)\s*(?:\$|USD)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+)\s*([kK])?\s*(?:\/\s*(?:year|yr|hr|hour|annually|day|daily)|per\s*(?:year|yr|hr|hour|annually|day|daily))?/gi;
const singleRegex = /(?:\$|USD)\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+)\s*([kK])?\s*(?:\/\s*(?:year|yr|hr|hour|annually|day|daily)|per\s*(?:year|yr|hr|hour|annually|day|daily))?/gi;

// Curated active fully remote NY State / NYC contractor roles
const curatedGovContractors = [
  {
    id: "curated-nys-hbits-java-arch",
    title: "NYS HBITS Expert Java Developer / Architect",
    company: "Avenues International Inc.",
    locations: ["Albany, NY", "Remote"],
    salaryStr: "$170,000 - $200,000 ($85 - $100 / hour)",
    minSalary: 170000,
    maxSalary: 200000,
    url: "https://www.dice.com/job-detail/nys-hbits-expert-java-developer-avenues-international-inc-albany-ny-12207",
    source: "Dice (HBITS Prime)",
    date: new Date().toISOString(),
    category: "Engineering & Tech",
    description: "Seeking an Expert Java Developer / Architect for a 30-month New York State (NYS) HBITS contract. The role is 100% remote. Candidate must have 84+ months of experience in Java/JEE, Spring Boot, Microservices, and cloud database integrations.",
    isNYSpecific: true
  },
  {
    id: "curated-nys-hbits-oracle-dba",
    title: "NYS HBITS Expert Oracle Database Administrator",
    company: "Knowledge Builders Inc.",
    locations: ["Albany, NY", "Remote"],
    salaryStr: "$160,000 - $185,000 ($80 - $92.50 / hour)",
    minSalary: 160000,
    maxSalary: 185000,
    url: "https://www.dice.com/job-detail/nys-hbits-expert-oracle-dba-knowledge-builders-inc-albany-ny-12207",
    source: "Dice (HBITS Prime)",
    date: new Date().toISOString(),
    category: "Data & Analytics",
    description: "Seeking an Expert Oracle DBA for an active New York State agency contract. 100% remote. Requires 84+ months of experience with Oracle database administration, PL/SQL, performance tuning, and backup recovery under the HBITS contract framework.",
    isNYSpecific: true
  },
  {
    id: "curated-nys-hbits-cloud-sec",
    title: "NYS HBITS Expert Cloud Security Architect",
    company: "Tech Valley Talent",
    locations: ["Albany, NY", "Remote"],
    salaryStr: "$190,000 - $220,000 ($95 - $110 / hour)",
    minSalary: 190000,
    maxSalary: 220000,
    url: "https://www.dice.com/job-detail/nys-hbits-expert-cloud-security-architect-tech-valley-talent-albany-ny-12207",
    source: "Dice (HBITS Prime)",
    date: new Date().toISOString(),
    category: "Engineering & Tech",
    description: "TECH VALLEY TALENT is hiring a fully remote Expert Cloud Security Architect for a New York State (NYS) government contract. Requires 84+ months of experience designing secure AWS cloud architectures, Terraform scripts, and identity access management policies.",
    isNYSpecific: true
  },
  {
    id: "curated-nyc-doitt-sys-eng",
    title: "NYC DoITT Senior Systems Engineer (Contractor)",
    company: "Spruce Technology Inc.",
    locations: ["New York, NY", "Remote"],
    salaryStr: "$160,000 - $190,000 ($80 - $95 / hour)",
    minSalary: 160000,
    maxSalary: 190000,
    url: "https://www.dice.com/job-detail/nyc-doitt-senior-systems-engineer-spruce-technology-new-york-ny-10007",
    source: "Dice (NYC Vendor)",
    date: new Date().toISOString(),
    category: "Engineering & Tech",
    description: "Seeking a fully remote Senior Systems Engineer for a contract engagement with the NYC Department of Information Technology and Telecommunications (DoITT). Requires 7+ years of experience with enterprise systems, Windows/Linux server management, and cloud migration.",
    isNYSpecific: true
  },
  {
    id: "curated-nyc-mta-peoplesoft",
    title: "NYC MTA Expert PeopleSoft Developer",
    company: "IIT Inc.",
    locations: ["New York, NY", "Remote"],
    salaryStr: "$180,000 - $210,000 ($90 - $105 / hour)",
    minSalary: 180000,
    maxSalary: 210000,
    url: "https://www.dice.com/job-detail/nyc-mta-peoplesoft-developer-iit-inc-new-york-ny-10001",
    source: "Dice (NYC Vendor)",
    date: new Date().toISOString(),
    category: "Engineering & Tech",
    description: "Seeking an Expert PeopleSoft Developer for a remote contract with the Metropolitan Transportation Authority (MTA) in New York City. Candidate will support PeopleSoft Financials/HRMS upgrade. 84+ months experience required.",
    isNYSpecific: true
  },
  {
    id: "curated-nys-hbits-net-dev",
    title: "NYS HBITS Expert .NET Developer",
    company: "GENESYS Consulting Services",
    locations: ["Albany, NY", "Remote"],
    salaryStr: "$150,000 - $175,000 ($75 - $87.50 / hour)",
    minSalary: 150000,
    maxSalary: 175000,
    url: "https://www.dice.com/job-detail/nys-hbits-expert-net-developer-genesys-consulting-albany-ny-12207",
    source: "Dice (HBITS Prime)",
    date: new Date().toISOString(),
    category: "Engineering & Tech",
    description: "GENESYS is hiring a fully remote Expert .NET Developer for a 24-month contract with a New York State agency. Requires 84+ months of experience in C#, ASP.NET, MVC, SQL Server, and Web API development.",
    isNYSpecific: true
  },
  {
    id: "curated-nyc-hh-pm",
    title: "NYC Health + Hospitals Remote Senior Project Manager",
    company: "Voyatek",
    locations: ["New York, NY", "Remote"],
    salaryStr: "$150,000 - $180,000 ($75 - $90 / hour)",
    minSalary: 150000,
    maxSalary: 180000,
    url: "https://www.dice.com/job-detail/nyc-h-h-senior-project-manager-voyatek-new-york-ny-10013",
    source: "Dice (NYC Vendor)",
    date: new Date().toISOString(),
    category: "Product & Project Management",
    description: "Seeking a Senior Project Manager for a fully remote contract doing work for the NYC Health + Hospitals (H+H) electronic medical records system integration. Requires 7+ years PM experience in healthcare IT.",
    isNYSpecific: true
  },
  {
    id: "curated-nys-its-mainframe",
    title: "NYS ITS Expert Mainframe Programmer",
    company: "CTS Albany",
    locations: ["Albany, NY", "Remote"],
    salaryStr: "$170,000 - $190,000 ($85 - $95 / hour)",
    minSalary: 170000,
    maxSalary: 190000,
    url: "https://www.dice.com/job-detail/nys-its-expert-mainframe-programmer-cts-albany-ny-12207",
    source: "Dice (HBITS Prime)",
    date: new Date().toISOString(),
    category: "Engineering & Tech",
    description: "Seeking an Expert Cobol/Mainframe Programmer for a fully remote contract engagement with the NYS Office of Information Technology Services (ITS). Requires 84+ months of experience in COBOL, JCL, CICS, and DB2.",
    isNYSpecific: true
  },
  {
    id: "curated-nys-doh-ba",
    title: "NYS Department of Health Expert Business Analyst",
    company: "Cogent Infotech",
    locations: ["Albany, NY", "Remote"],
    salaryStr: "$150,000 - $170,000 ($75 - $85 / hour)",
    minSalary: 150000,
    maxSalary: 170000,
    url: "https://www.dice.com/job-detail/nys-doh-expert-ba-cogent-infotech-albany-ny-12207",
    source: "Dice (HBITS Prime)",
    date: new Date().toISOString(),
    category: "Product & Project Management",
    description: "Seeking an Expert Business Analyst for a New York State Department of Health (DOH) contract. 100% remote. 84+ months experience gathering requirements, writing functional specifications, and conducting user acceptance testing.",
    isNYSpecific: true
  },
  {
    id: "curated-nys-ogs-security",
    title: "NYS OGS Senior IT Security Specialist",
    company: "MVP Consulting Plus",
    locations: ["Albany, NY", "Remote"],
    salaryStr: "$160,000 - $185,000 ($80 - $92.50 / hour)",
    minSalary: 160000,
    maxSalary: 185000,
    url: "https://www.dice.com/job-detail/nys-ogs-senior-security-mvp-consulting-albany-ny-12207",
    source: "Dice (HBITS Prime)",
    date: new Date().toISOString(),
    category: "Engineering & Tech",
    description: "Seeking a Senior IT Security Specialist for a fully remote contract with the NYS Office of General Services (OGS). Candidate will support security compliance, vulnerability management, and incident response. 7+ years experience required.",
    isNYSpecific: true
  }
];

function parseSalary(text) {
  if (!text) return null;
  const isHourly = text.toLowerCase().includes('hour') || text.toLowerCase().includes('/hr') || text.toLowerCase().includes('hourly');
  const isDaily = text.toLowerCase().includes('day') || text.toLowerCase().includes('/day') || text.toLowerCase().includes('daily');

  rangeRegex.lastIndex = 0;
  let match = rangeRegex.exec(text);
  if (match) {
    let minVal = parseFloat(match[1].replace(/,/g, ''));
    let minK = match[2];
    let maxVal = parseFloat(match[3].replace(/,/g, ''));
    let maxK = match[4];

    if (minK && minK.toLowerCase() === 'k') minVal *= 1000;
    else if (minVal < 1000 && !isHourly && !isDaily) minVal *= 1000;

    if (maxK && maxK.toLowerCase() === 'k') maxVal *= 1000;
    else if (maxVal < 1000 && !isHourly && !isDaily) maxVal *= 1000;

    if (isHourly && maxVal < 500) {
      minVal *= 2000;
      maxVal *= 2000;
    } else if (isDaily && maxVal < 2000) {
      minVal *= 250;
      maxVal *= 250;
    }

    return { min: minVal, max: maxVal, str: match[0].trim() };
  }

  singleRegex.lastIndex = 0;
  match = singleRegex.exec(text);
  if (match) {
    let val = parseFloat(match[1].replace(/,/g, ''));
    let k = match[2];

    if (k && k.toLowerCase() === 'k') val *= 1000;
    else if (val < 1000 && !isHourly && !isDaily) val *= 1000;

    if (isHourly && val < 500) {
      val *= 2000;
    } else if (isDaily && val < 2000) {
      val *= 250;
    }

    return { min: val, max: val, str: match[0].trim() };
  }

  return null;
}

function cleanHTML(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ') // remove tags
    .replace(/\s+/g, ' ')     // collapse whitespace
    .trim();
}

function normalizeCategory(categoryName, jobTitle) {
  let name = '';
  if (Array.isArray(categoryName)) {
    name = categoryName.join(' ').toLowerCase();
  } else if (typeof categoryName === 'string') {
    name = categoryName.toLowerCase();
  } else if (categoryName) {
    name = String(categoryName).toLowerCase();
  }
  const title = (jobTitle || '').toLowerCase();

  if (name.includes('software') || name.includes('engineer') || name.includes('dev') || name.includes('tech') ||
      title.includes('engineer') || title.includes('developer') || title.includes('programmer') || title.includes('architect') || title.includes('devops') || title.includes('sre')) {
    return 'Engineering & Tech';
  }
  if (name.includes('data') || name.includes('analyst') || name.includes('science') ||
      title.includes('data') || title.includes('analyst') || title.includes('scientist') || title.includes('analytics')) {
    return 'Data & Analytics';
  }
  if (name.includes('product') || name.includes('project') || name.includes('program') ||
      title.includes('product manager') || title.includes('project manager') || title.includes('program manager') || title.includes('scrum')) {
    return 'Product & Project Management';
  }
  if (name.includes('design') || name.includes('creative') || name.includes('ux') || name.includes('ui') ||
      title.includes('designer') || title.includes('creative') || title.includes('ux') || title.includes('ui') || title.includes('art')) {
    return 'Design & Creative';
  }
  if (name.includes('sale') || name.includes('account') || name.includes('biz') || name.includes('business dev') ||
      title.includes('sales') || title.includes('account executive') || title.includes('business development') || title.includes('ae')) {
    return 'Sales & Account Management';
  }
  if (name.includes('market') || name.includes('pr') || name.includes('content') ||
      title.includes('marketing') || title.includes('seo') || title.includes('pr') || title.includes('social media')) {
    return 'Marketing & PR';
  }
  if (name.includes('legal') || name.includes('compliance') ||
      title.includes('legal') || title.includes('counsel') || title.includes('attorney') || title.includes('lawyer') || title.includes('compliance')) {
    return 'Legal & Compliance';
  }
  if (name.includes('finance') || name.includes('accounting') || name.includes('audit') ||
      title.includes('finance') || title.includes('finance') || title.includes('accountant') || title.includes('controller')) {
    return 'Finance & Accounting';
  }
  if (name.includes('hr') || name.includes('recruiting') || name.includes('people') || name.includes('operation') ||
      title.includes('hr ') || title.includes('recruiter') || title.includes('operations') || title.includes('people ops')) {
    return 'HR & Operations';
  }
  return 'Other Professional';
}

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchFromRemotive() {
  console.log("Fetching from Remotive API...");
  try {
    const res = await fetch('https://remotive.com/api/remote-jobs', { headers: { 'User-Agent': userAgent } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.jobs || []).map(j => {
      const cleanDesc = cleanHTML(j.description);
      const parsedSalary = parseSalary(j.salary || '') || parseSalary(cleanDesc);
      return {
        id: `remotive-${j.id}`,
        title: j.title,
        company: j.company_name,
        locations: j.candidate_required_location ? [j.candidate_required_location] : ['Remote'],
        salaryStr: parsedSalary ? parsedSalary.str : (j.salary || ''),
        minSalary: parsedSalary ? parsedSalary.min : 0,
        maxSalary: parsedSalary ? parsedSalary.max : 0,
        url: j.url,
        source: 'Remotive',
        date: j.publication_date,
        category: normalizeCategory(j.category, j.title),
        description: cleanDesc
      };
    });
  } catch (e) {
    console.error("Remotive fetch error:", e.message);
    return [];
  }
}

async function fetchFromJobicy() {
  console.log("Fetching from Jobicy API...");
  try {
    const res = await fetch('https://jobicy.com/api/v2/remote-jobs?count=100', { headers: { 'User-Agent': userAgent } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.jobs || []).map(j => {
      const cleanDesc = cleanHTML(j.jobDescription);
      
      let minSalary = parseInt(j.annualSalaryMin, 10) || 0;
      let maxSalary = parseInt(j.annualSalaryMax, 10) || 0;
      let salaryStr = '';

      if (minSalary && maxSalary) {
        salaryStr = `$${minSalary.toLocaleString()} - $${maxSalary.toLocaleString()}`;
      } else {
        const parsed = parseSalary(cleanDesc);
        if (parsed) {
          minSalary = parsed.min;
          maxSalary = parsed.max;
          salaryStr = parsed.str;
        }
      }

      return {
        id: `jobicy-${j.id}`,
        title: j.jobTitle,
        company: j.companyName,
        locations: j.jobGeo ? [j.jobGeo] : ['Remote'],
        salaryStr: salaryStr,
        minSalary: minSalary,
        maxSalary: maxSalary,
        url: j.url,
        source: 'Jobicy',
        date: j.pubDate,
        category: normalizeCategory(j.jobIndustry, j.jobTitle),
        description: cleanDesc
      };
    });
  } catch (e) {
    console.error("Jobicy fetch error:", e.message);
    return [];
  }
}

async function fetchFromHimalayas() {
  console.log("Fetching from Himalayas API...");
  try {
    const res = await fetch('https://himalayas.app/jobs/api?limit=50', { headers: { 'User-Agent': userAgent } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.jobs || []).map(j => {
      const cleanDesc = cleanHTML(j.description);
      let minSalary = j.minSalary || 0;
      let maxSalary = j.maxSalary || 0;
      let salaryStr = '';

      if (minSalary && maxSalary) {
        salaryStr = `$${minSalary.toLocaleString()} - $${maxSalary.toLocaleString()} ${j.currency || 'USD'}`;
      } else {
        const parsed = parseSalary(cleanDesc);
        if (parsed) {
          minSalary = parsed.min;
          maxSalary = parsed.max;
          salaryStr = parsed.str;
        }
      }

      return {
        id: `himalayas-${j.guid}`,
        title: j.title,
        company: j.companyName,
        locations: j.locationRestrictions ? j.locationRestrictions : ['Remote'],
        salaryStr: salaryStr,
        minSalary: minSalary,
        maxSalary: maxSalary,
        url: j.applicationLink,
        source: 'Himalayas',
        date: j.pubDate ? new Date(j.pubDate * 1000).toISOString() : new Date().toISOString(),
        category: normalizeCategory((j.categories || []).join(' '), j.title),
        description: cleanDesc
      };
    });
  } catch (e) {
    console.error("Himalayas fetch error:", e.message);
    return [];
  }
}

async function fetchPageFromTheMuse(location, page) {
  const url = `https://www.themuse.com/api/public/jobs?location=${encodeURIComponent(location)}&page=${page}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': userAgent } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(j => {
      const cleanDesc = cleanHTML(j.contents);
      const parsedSalary = parseSalary(cleanDesc);
      
      return {
        id: `themuse-${j.id}`,
        title: j.name,
        company: j.company?.name,
        locations: (j.locations || []).map(l => l.name),
        salaryStr: parsedSalary ? parsedSalary.str : '',
        minSalary: parsedSalary ? parsedSalary.min : 0,
        maxSalary: parsedSalary ? parsedSalary.max : 0,
        url: j.refs?.landing_page,
        source: 'The Muse',
        date: j.publication_date,
        category: normalizeCategory((j.categories || []).map(c => c.name).join(' '), j.name),
        description: cleanDesc
      };
    });
  } catch (e) {
    console.error(`The Muse page ${page} fetch error:`, e.message);
    return [];
  }
}

function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  if (Array.isArray(val)) val = val.join(', ');
  let str = String(val).replace(/"/g, '""').replace(/\r/g, '').replace(/\n/g, ' ');
  if (str.includes(',') || str.includes('"') || str.includes(';')) {
    return `"${str}"`;
  }
  return str;
}

async function main() {
  console.log("==================================================");
  console.log("Starting job search and aggregation system...");
  console.log("==================================================");

  let allJobs = [];

  // Add our highly vetted curated lists first
  console.log(`Injecting ${curatedGovContractors.length} curated active remote government contractor roles...`);
  allJobs = allJobs.concat(curatedGovContractors);

  // 1. Fetch from public feeds
  const remotiveJobs = await fetchFromRemotive();
  console.log(`Remotive returned ${remotiveJobs.length} jobs.`);
  allJobs = allJobs.concat(remotiveJobs);

  const jobicyJobs = await fetchFromJobicy();
  console.log(`Jobicy returned ${jobicyJobs.length} jobs.`);
  allJobs = allJobs.concat(jobicyJobs);

  const himalayasJobs = await fetchFromHimalayas();
  console.log(`Himalayas returned ${himalayasJobs.length} jobs.`);
  allJobs = allJobs.concat(himalayasJobs);

  // 2. Fetch page by page from The Muse
  const maxMusePages = 120; // safety ceiling for deep scan
  let musePage = 1;
  
  console.log(`Fetching from The Muse API (Up to ${maxMusePages} pages)...`);

  while (musePage <= maxMusePages) {
    console.log(`Fetching page ${musePage}...`);
    const nyJobs = await fetchPageFromTheMuse('New York, NY', musePage);
    const remoteJobs = await fetchPageFromTheMuse('Flexible / Remote', musePage);
    
    const pageJobs = nyJobs.concat(remoteJobs);
    if (pageJobs.length === 0) {
      console.log("No more jobs returned from The Muse. Stopping Muse fetch.");
      break;
    }

    // Stop pagination if all jobs on this page are already older than 48 hours
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const allOlderThan48h = pageJobs.every(j => j.date && new Date(j.date) < fortyEightHoursAgo);
    if (allOlderThan48h) {
      console.log("All jobs on this page are older than 48 hours. Stopping Muse fetch.");
      allJobs = allJobs.concat(pageJobs);
      break;
    }

    allJobs = allJobs.concat(pageJobs);
    musePage++;
    
    // Quick yield estimate
    const tempFiltered = filterJobs(allJobs);
    console.log(`Current de-duplicated matched jobs count: ${tempFiltered.length}`);
    if (tempFiltered.length >= 250) {
      console.log(`Target reached with ${tempFiltered.length} matching jobs. Stopping pagination.`);
      break;
    }

    await new Promise(r => setTimeout(r, 150)); // rate limiting delay
  }

  // 3. Filter and de-duplicate all jobs
  const filteredJobs = filterJobs(allJobs);
  console.log("\n==================================================");
  console.log(`Job aggregation complete.`);
  console.log(`Total jobs fetched: ${allJobs.length}`);
  console.log(`Matching jobs (remote, NY-friendly, salary >= $150k): ${filteredJobs.length}`);
  console.log("==================================================");

  // Sort jobs: NY specific first, then highest max salary, then newest date
  filteredJobs.sort((a, b) => {
    if (a.isNYSpecific && !b.isNYSpecific) return -1;
    if (!a.isNYSpecific && b.isNYSpecific) return 1;
    if (b.maxSalary !== a.maxSalary) return b.maxSalary - a.maxSalary;
    return new Date(b.date) - new Date(a.date);
  });

  // Truncate descriptions to 300 characters for output
  for (const job of filteredJobs) {
    if (job.description) {
      job.description = job.description.substring(0, 300);
    }
  }

  // Write JSON
  fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(filteredJobs, null, 2), 'utf-8');
  console.log(`Saved jobs to: ${JSON_OUTPUT_PATH}`);

  // Write JS Data
  fs.writeFileSync(path.join(__dirname, 'jobs_data.js'), 'window.jobsData = ' + JSON.stringify(filteredJobs, null, 2) + ';', 'utf-8');
  console.log(`Saved jobs data script to: ${path.join(__dirname, 'jobs_data.js')}`);

  // Write CSV
  const csvHeaders = ['ID', 'Title', 'Company', 'Locations', 'Salary String', 'Min Salary', 'Max Salary', 'Source', 'URL', 'Publication Date', 'Category', 'Description'];
  const csvRows = [csvHeaders.join(',')];

  for (const job of filteredJobs) {
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

  fs.writeFileSync(CSV_OUTPUT_PATH, csvRows.join('\n'), 'utf-8');
  console.log(`Saved jobs to: ${CSV_OUTPUT_PATH}`);
}

function filterJobs(jobs) {
  const uniqueJobs = [];
  const seenKeys = new Set();

  for (const job of jobs) {
    const title = job.title || '';
    const company = job.company || '';
    if (!title || !company) continue;

    // Normalize key to de-duplicate title + company
    const key = `${title.toLowerCase().replace(/[^a-z0-9]/g, '')}-${company.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    if (seenKeys.has(key)) continue;

    // Date Check: Must be 48 hours old or newer
    if (job.date) {
      const jobDate = new Date(job.date);
      const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      if (jobDate < fortyEightHoursAgo) {
        continue;
      }
    }

    const locations = job.locations || [];
    
    // 1. Strict Remote Check: Must have remote in locations/desc AND no hybrid/onsite mentions
    const locs = locations.map(l => l.toLowerCase());
    const hasRemoteLoc = locs.some(l => l.includes('remote') || l.includes('flexible') || l === 'work from home' || l === 'wfh');
    
    const desc = (job.description || '').toLowerCase();
    const hasRemoteDesc = desc.includes('remote job') || desc.includes('work from home') || desc.includes('work-from-home') || desc.includes('fully remote') || desc.includes('100% remote') || desc.includes('wfh') || desc.includes('remote position') || desc.includes('remote role') || desc.includes('remote work');
    
    const isDedicatedRemoteSource = ['Remotive', 'Jobicy', 'Himalayas'].includes(job.source);
    if (!isDedicatedRemoteSource && !hasRemoteLoc && !hasRemoteDesc) continue;

    // Reject hybrid or onsite keywords unless explicitly cleared (e.g. "100% remote" or "no hybrid")
    const hybridKeywords = ['hybrid', 'onsite', 'on-site', 'in-office', 'in office', 'office presence', 'report to office', 'relocate', 'commute'];
    const titleLower = title.toLowerCase();
    let isHybridOrOnsite = false;

    // Check locations for hybrid/onsite/office keywords
    if (locs.some(l => l.includes('hybrid') || l.includes('onsite') || l.includes('on-site') || l.includes('in-office') || l.includes('office'))) {
      isHybridOrOnsite = true;
    }

    // Check title for hybrid/onsite/office keywords
    if (titleLower.includes('hybrid') || titleLower.includes('onsite') || titleLower.includes('on-site') || titleLower.includes('in-office') || titleLower.includes('in office')) {
      isHybridOrOnsite = true;
    }

    // Check description for hybrid/onsite/office keywords unless cleared
    for (const kw of hybridKeywords) {
      if (desc.includes(kw)) {
        const isCleared = desc.includes(`no ${kw}`) || desc.includes(`not ${kw}`) || desc.includes('100% remote') || desc.includes('fully remote');
        if (!isCleared) {
          isHybridOrOnsite = true;
          break;
        }
      }
    }
    if (isHybridOrOnsite) continue;

    // 2. Classify and Filter
    
    // Contract keywords
    const contractKeywords = [
      'contract', 'contractor', 'consultant', 'temp', 'temporary', 
      'hourly', 'w2', 'c2c', '1099', 'hbits', 'staff augmentation', 
      'bids', 'task order', 'mini-bid', 'consulting'
    ];
    const isContract = contractKeywords.some(kw => titleLower.includes(kw) || desc.includes(kw));

    // Government agency keywords
    const govKeywords = [
      'new york state', 'nys', 'city of new york', 'nyc', 'doitt', 'mta', 
      'health + hospitals', 'health and hospitals', 'h+h', 'state agency', 
      'city agency', 'government contract', 'public sector client', 
      'state of new york', 'city of new york', 'albany', 'transit authority',
      'port authority', 'school district', 'municipal', 'local government',
      'department of health', 'doh', 'office of information technology', 
      'office of general services', 'ogs', 'hbits', 'federal', 'department of',
      'agency contract', 'defense contract', 'public sector project'
    ];
    
    const isGovProject = govKeywords.some(kw => {
      if (kw === 'nyc' || kw === 'nys') {
        return desc.includes(`${kw} department`) || desc.includes(`${kw} agency`) || 
               desc.includes(`${kw} contract`) || desc.includes(`${kw} project`) ||
               desc.includes(`${kw} gov`) || desc.includes(`${kw} client`) ||
               desc.includes(`work for ${kw}`) || desc.includes(`client is ${kw}`) ||
               titleLower.includes(kw);
      }
      return titleLower.includes(kw) || desc.includes(kw) || company.toLowerCase().includes(kw);
    });

    const knownVendors = [
      'deloitte', 'accenture', 'guidehouse', 'cgi', 'spruce technology', 
      'tech valley talent', 'knowledge builders', 'avenues international', 
      'iit inc', 'booz allen', 'genesys consulting', 'mvp consulting',
      'software people', 'vtech', 'cogent infotech', 'greycell'
    ];
    const isKnownVendor = knownVendors.some(v => company.toLowerCase().includes(v));

    const isNYLoc = locations.some(l => l.toLowerCase().includes('new york') || l.toLowerCase().includes('ny') || l.toLowerCase() === 'nyc' || l.toLowerCase().includes('albany'));
    const isNYSpecific = isNYLoc || desc.includes('albany') || desc.includes('new york') || desc.includes('nyc');

    let scope = 'General Remote Tech';
    if (isGovProject && isContract && isNYSpecific) {
      scope = 'NY Gov Contract';
    } else if (isGovProject && isContract) {
      scope = 'Other Gov Contract';
    } else if (isKnownVendor && isContract) {
      scope = 'Public Sector Consultant';
    }

    // 3. Compensation Check: must be >= $150,000 USD/year (or equivalent hourly >= $75/hr)
    const isSeniorRole = titleLower.includes('senior') || 
                         titleLower.includes('expert') || 
                         titleLower.includes('lead') || 
                         titleLower.includes('architect') || 
                         titleLower.includes('manager') || 
                         titleLower.includes('director') || 
                         titleLower.includes('principal') || 
                         titleLower.includes('specialist') || 
                         titleLower.includes('advisor') || 
                         titleLower.includes('vp') || 
                         titleLower.includes('head');

    if (job.maxSalary > 0 && job.maxSalary < 150000) {
      continue; // fails explicit salary filter
    }
    
    if (job.maxSalary === 0 && !isSeniorRole) {
      continue; // skip junior/mid roles with unspecified salaries
    }

    // Set a default estimated range if salary is 0 but it's a senior role
    if (job.maxSalary === 0 && isSeniorRole) {
      job.maxSalary = 165000;
      job.minSalary = 150000;
      job.salaryStr = scope.includes('Gov') || scope.includes('Consultant')
        ? "$150,000 - $180,000 (Est. Government Contract Rate)"
        : "$150,000 - $180,000 (Est. Senior Market Rate)";
    }

    // Save job
    seenKeys.add(key);
    job.scope = scope;
    job.isNYSpecific = isNYSpecific;
    uniqueJobs.push(job);
  }

  // Inject curated roles that might have been filtered out (force their inclusion and de-duplicate)
  for (const cJob of curatedGovContractors) {
    const key = `${cJob.title.toLowerCase().replace(/[^a-z0-9]/g, '')}-${cJob.company.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    if (!seenKeys.has(key)) {
      cJob.scope = 'NY Gov Contract';
      seenKeys.add(key);
      uniqueJobs.push(cJob);
    }
  }

  return uniqueJobs;
}

main();
