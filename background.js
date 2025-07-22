// Check if job ID exists in storage when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('jobId', (data) => {
    if (!data.jobId) {
      // Open options page if no job ID is found
      chrome.tabs.create({ url: 'options.html' });
    }
  });
});