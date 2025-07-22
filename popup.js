

// DOM Elements
const saveInfoBtn = document.getElementById('save-info-btn');
const startBtn = document.getElementById('startBtn');
const editBtn = document.getElementById('edit-btn');
const infoStatus = document.getElementById('info-status');

// Function to open options page in a new tab
function openOptionsPage() {
  chrome.tabs.create({ url: 'options.html' });
  window.close(); // Close the popup after opening options
}

// Function to update UI based on saved data
function updateUI() {
  chrome.storage.sync.get(['personalInfo'], (data) => {
    const personalInfo = data.personalInfo;
    
    if (personalInfo) {
      // Update status message
      const lastUpdated = personalInfo.lastUpdated 
        ? new Date(personalInfo.lastUpdated).toLocaleString() 
        : 'just now';
      infoStatus.textContent = `Last updated: ${lastUpdated}`;
      infoStatus.style.color = '#4CAF50';
      
      // Update save button state
      saveInfoBtn.disabled = true;
      saveInfoBtn.textContent = 'Information Saved';
      
      // Enable auto-fill button
      //autoFillBtn.disabled = false;
    } else {
      // No saved data
      infoStatus.textContent = 'No information saved yet';
      infoStatus.style.color = '#666';
      saveInfoBtn.disabled = false;
      saveInfoBtn.textContent = 'Save Info';
      //autoFillBtn.disabled = true;
    }
  });
}

// Event Listeners
// Edit button - opens options page
editBtn.addEventListener('click', openOptionsPage);

// Auto-fill button - sends message to content script
startBtn.addEventListener('click', async () => {
  try {
    infoStatus.textContent = 'Filling forms...';
    infoStatus.style.color = '#2196F3';
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.id) {
      throw new Error('No active tab found');
    }
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: startFilling
    });
    
    infoStatus.textContent = 'Forms filled successfully!';
    infoStatus.style.color = '#4CAF50';
    
    // Close popup after a short delay
    setTimeout(() => window.close(), 1000);
  } catch (error) {
    console.error('Auto-fill error:', error);
    infoStatus.textContent = `Error: ${error.message}`;
    infoStatus.style.color = '#f44336';
  }
});

function startFilling() {
  try {
    window.postMessage({ type: "START_FILLING" }, "*");
    return { success: true };
  } catch (error) {
    console.error('Content script error:', error);
    return { success: false, error: error.message };
  }
}

// Save Info button - opens options page to save new info
saveInfoBtn.addEventListener('click', openOptionsPage);

// Close popup when clicking outside
document.addEventListener('click', (e) => {
  if (e.target === document.documentElement) {
    window.close();
  }
});

// Tab switching functionality
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs and tab contents
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    tab.classList.add('active');
    const tabId = tab.getAttribute('data-tab');
    document.getElementById(`${tabId}-tab`).classList.add('active');
  });
});

// Initialize the popup
updateUI();
