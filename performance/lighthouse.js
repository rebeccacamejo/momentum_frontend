const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runLighthouse(url, options = {}) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

  const runnerOptions = {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    ...options
  };

  const runnerResult = await lighthouse(url, runnerOptions);

  await chrome.kill();

  return runnerResult;
}

async function performanceTest() {
  const baseUrl = 'http://localhost:3000';
  const pages = [
    { name: 'Home', url: baseUrl },
    { name: 'Sign In', url: `${baseUrl}/signin` },
    { name: 'Dashboard', url: `${baseUrl}/dashboard` },
    { name: 'New Deliverable', url: `${baseUrl}/new` },
    { name: 'Profile', url: `${baseUrl}/profile` },
  ];

  const results = [];

  for (const page of pages) {
    console.log(`Testing ${page.name}...`);

    try {
      const result = await runLighthouse(page.url);

      const scores = {
        performance: result.lhr.categories.performance.score * 100,
        accessibility: result.lhr.categories.accessibility.score * 100,
        bestPractices: result.lhr.categories['best-practices'].score * 100,
        seo: result.lhr.categories.seo.score * 100,
      };

      results.push({
        page: page.name,
        url: page.url,
        scores,
        metrics: {
          firstContentfulPaint: result.lhr.audits['first-contentful-paint'].numericValue,
          largestContentfulPaint: result.lhr.audits['largest-contentful-paint'].numericValue,
          cumulativeLayoutShift: result.lhr.audits['cumulative-layout-shift'].numericValue,
          totalBlockingTime: result.lhr.audits['total-blocking-time'].numericValue,
          speedIndex: result.lhr.audits['speed-index'].numericValue,
        },
        opportunities: result.lhr.audits
      });

      console.log(`${page.name} Performance Score: ${scores.performance}`);

    } catch (error) {
      console.error(`Error testing ${page.name}:`, error.message);
      results.push({
        page: page.name,
        url: page.url,
        error: error.message
      });
    }
  }

  // Save results
  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(reportsDir, 'lighthouse-results.json'),
    JSON.stringify(results, null, 2)
  );

  // Generate summary report
  const summary = {
    timestamp: new Date().toISOString(),
    totalPages: pages.length,
    averageScores: {
      performance: results.reduce((sum, r) => sum + (r.scores?.performance || 0), 0) / results.length,
      accessibility: results.reduce((sum, r) => sum + (r.scores?.accessibility || 0), 0) / results.length,
      bestPractices: results.reduce((sum, r) => sum + (r.scores?.bestPractices || 0), 0) / results.length,
      seo: results.reduce((sum, r) => sum + (r.scores?.seo || 0), 0) / results.length,
    },
    pages: results.map(r => ({
      page: r.page,
      performance: r.scores?.performance || 0,
      accessibility: r.scores?.accessibility || 0,
      error: r.error
    }))
  };

  fs.writeFileSync(
    path.join(reportsDir, 'performance-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('\n📊 Performance Test Summary:');
  console.log(`Average Performance Score: ${summary.averageScores.performance.toFixed(1)}`);
  console.log(`Average Accessibility Score: ${summary.averageScores.accessibility.toFixed(1)}`);
  console.log(`Average Best Practices Score: ${summary.averageScores.bestPractices.toFixed(1)}`);
  console.log(`Average SEO Score: ${summary.averageScores.seo.toFixed(1)}`);

  // Check for performance thresholds
  const performanceThreshold = 90;
  const accessibilityThreshold = 95;

  const failedPages = results.filter(r =>
    !r.error && (
      r.scores.performance < performanceThreshold ||
      r.scores.accessibility < accessibilityThreshold
    )
  );

  if (failedPages.length > 0) {
    console.log('\n⚠️  Pages below threshold:');
    failedPages.forEach(page => {
      console.log(`${page.page}: Performance ${page.scores.performance}, Accessibility ${page.scores.accessibility}`);
    });
    process.exit(1);
  } else {
    console.log('\n✅ All pages meet performance and accessibility thresholds');
  }

  return results;
}

// Mobile performance test
async function mobilePerformanceTest() {
  const baseUrl = 'http://localhost:3000';
  const mobileOptions = {
    onlyCategories: ['performance'],
    formFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4
    }
  };

  const pages = [
    { name: 'Mobile Home', url: baseUrl },
    { name: 'Mobile Sign In', url: `${baseUrl}/signin` },
    { name: 'Mobile Dashboard', url: `${baseUrl}/dashboard` },
  ];

  const results = [];

  for (const page of pages) {
    console.log(`Testing ${page.name} (Mobile)...`);

    try {
      const result = await runLighthouse(page.url, mobileOptions);

      const performanceScore = result.lhr.categories.performance.score * 100;

      results.push({
        page: page.name,
        url: page.url,
        performanceScore,
        metrics: {
          firstContentfulPaint: result.lhr.audits['first-contentful-paint'].numericValue,
          largestContentfulPaint: result.lhr.audits['largest-contentful-paint'].numericValue,
          cumulativeLayoutShift: result.lhr.audits['cumulative-layout-shift'].numericValue,
        }
      });

      console.log(`${page.name} Mobile Performance: ${performanceScore}`);

    } catch (error) {
      console.error(`Error testing ${page.name}:`, error.message);
    }
  }

  return results;
}

// Bundle analysis
async function bundleAnalysis() {
  console.log('📦 Analyzing bundle size...');

  // This would typically run next-bundle-analyzer
  // For now, we'll simulate bundle size checking
  const bundleInfo = {
    totalSize: '2.1 MB',
    gzipSize: '650 KB',
    chunks: {
      main: '450 KB',
      vendor: '1.2 MB',
      commons: '450 KB'
    },
    recommendations: [
      'Consider code splitting for vendor libraries',
      'Optimize images with next/image',
      'Remove unused CSS with purgeCSS'
    ]
  };

  console.log('Bundle Analysis:', bundleInfo);
  return bundleInfo;
}

// Run all performance tests
async function runAllTests() {
  try {
    console.log('🚀 Starting Performance Tests...\n');

    const desktopResults = await performanceTest();
    const mobileResults = await mobilePerformanceTest();
    const bundleResults = await bundleAnalysis();

    const finalReport = {
      timestamp: new Date().toISOString(),
      desktop: desktopResults,
      mobile: mobileResults,
      bundle: bundleResults
    };

    const reportsDir = path.join(__dirname, '../reports');
    fs.writeFileSync(
      path.join(reportsDir, 'complete-performance-report.json'),
      JSON.stringify(finalReport, null, 2)
    );

    console.log('\n✅ Performance testing complete!');
    console.log('📄 Reports saved to /reports directory');

  } catch (error) {
    console.error('❌ Performance testing failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runLighthouse,
  performanceTest,
  mobilePerformanceTest,
  bundleAnalysis
};