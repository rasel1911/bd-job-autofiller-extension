// Default personal information
const defaultPersonalInfo = {
  name: "rasel",
  name_bn: "রাসেল",
  father: "Md.",
  father_bn: " ",
  mother: "",
  mother_bn: "বেগম",
  dob: "1995-05-20",
  nationality: "Bangladeshi",
  religion: "1",
  gender: "Male",
  nid_no: "1234567890123",
  mobile: "01712345678",
  email: "rasel@example.com",
  marital: "Single"
};

// Default address information
const defaultAddressInfo = {
  present_careof: 'jk',
  present_village: '',
  present_district: '',
  present_upazila: '',
  present_post: '',
  present_postcode: ''
};


  const  defaultAcademicInfo= {
  ssc_exam: "1",
  ssc_roll: "232323",
  ssc_group: "1",
  ssc_board: "14",
  ssc_result_type: "5",
  ssc_result: "5.00",
  ssc_year: "2015",
  
  hsc_exam: "1",
  hsc_roll: "323232",
  hsc_group: "1",
  hsc_board: "14",
  hsc_result_type: "5",
  hsc_result: "",
  hsc_year: "2017",

  gra_exam: "1",
  gra_institute: "273",
  gra_year: "2022",
  gra_subject: "306",
  gra_result_type: "4",
  gra_result: "",
  gra_duration: "04",
  };


// Generate a random job ID
function generateJobId() {
  return 'job_' + Math.random().toString(36).substr(2, 9);
}

// Helper to save any data
function saveToStorage(key, data) {
  const dataToSave = {
    ...data,
    lastUpdated: new Date().toISOString(),
    jobId: generateJobId()
  };
  chrome.storage.sync.set({ [key]: dataToSave }, function() {
    if (chrome.runtime.lastError) {
      console.error('Error saving data:', chrome.runtime.lastError);
      showStatus('Error saving data. Please try again.', 'error');
    } else {
      console.log(`${key} saved successfully`);
      showStatus('Information saved successfully!', 'success');
    }
  });
}

// Save personal information to Chrome storage
function savePersonalInfo(personalInfo) {
  console.log('Saving personal info:', personalInfo);
  alert('Saving personal info:');
  saveToStorage('personalInfo', personalInfo);
}

function saveAddressInfo(addressInfo) {
  console.log('Saving address info:', addressInfo);
  alert('Saving address info:');
  saveToStorage('addressInfo', addressInfo);
}

function saveAcademicInfo(academicInfo) {
  console.log('Saving academic info:', academicInfo);
  alert('Saving academic info:');
  saveToStorage('academicInfo', academicInfo);
}

// Generic load helper
function loadFromStorage(keys, callback) {
  chrome.storage.sync.get(keys, function(result){
    callback(result);
  });
}

// Load personal information from Chrome storage
function loadPersonalInfo() {
  loadFromStorage(['personalInfo'], function(result){
    const personalInfo = result.personalInfo || defaultPersonalInfo;
    populateFields(personalInfo);
  });
}

function loadAddressInfo() {
  loadFromStorage(['addressInfo'], function(result){
    const addressInfo = result.addressInfo || defaultAddressInfo;
    populateFields(addressInfo);
  });
}

function loadAcademicInfo() {
  loadFromStorage(['academicInfo'], function(result){
    const academicInfo = result.academicInfo || defaultAcademicInfo;
    populateFields(academicInfo);
  });
}

// Populate all inputs/selects/checkboxes for a given data object
function populateFields(dataObj){
  Object.keys(dataObj).forEach(key=>{
    const el = document.getElementById(key);
    if(!el) return;
    if(el.type === 'checkbox'){
      el.checked = dataObj[key];
    }else{
      el.value = dataObj[key];
    }
  });
}

// Collect data from a container (form/div)
function collectData(container){
  const data = {};
  const elements = container.querySelectorAll('input, select, textarea');
  elements.forEach(el=>{
    const key = el.name || el.id;
    if(!key) return;
    if(el.type === 'checkbox'){
      data[key] = el.checked;
    }else{
      data[key] = el.value;
    }
  });
  return data;
}

// Show status message
function showStatus(message, type = 'info') {
  // Remove any existing status messages
  const existingStatus = document.getElementById('status-message');
  if (existingStatus) {
    existingStatus.remove();
  }
  
  // Create and show new status message
  const statusDiv = document.createElement('div');
  statusDiv.id = 'status-message';
  statusDiv.textContent = message;
  
  // Style based on message type
  statusDiv.style.padding = '10px';
  statusDiv.style.margin = '10px 0';
  statusDiv.style.borderRadius = '4px';
  
  if (type === 'error') {
    statusDiv.style.backgroundColor = '#ffebee';
    statusDiv.style.color = '#c62828';
    statusDiv.style.border = '1px solid #ffcdd2';
  } else if (type === 'success') {
    statusDiv.style.backgroundColor = '#e8f5e9';
    statusDiv.style.color = '#2e7d32';
    statusDiv.style.border = '1px solid #c8e6c9';
  } else {
    statusDiv.style.backgroundColor = '#e3f2fd';
    statusDiv.style.color = '#1565c0';
    statusDiv.style.border = '1px solid #bbdefb';
  }
  
  // Insert the status message before the form
  const form = document.getElementById('personalInfoForm');
  form.parentNode.insertBefore(statusDiv, form);
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      if (statusDiv.parentNode) {
        statusDiv.style.opacity = '0';
        statusDiv.style.transition = 'opacity 1s';
        setTimeout(() => {
          if (statusDiv.parentNode) {
            statusDiv.remove();
          }
        }, 1000);
      }
    }, 5000);
  }
}

// Validate form data
function validateFormData(formData) {
  // Check required fields
  const requiredFields = ['name', 'name_bn', 'father', 'father_bn', 'mother', 'mother_bn', 'dob', 'nationality', 'nid_no', 'mobile', 'email'];
  const missingFields = requiredFields.filter(field => !formData[field]);
  
  if (missingFields.length > 0) {
    showStatus(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
    return false;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    showStatus('Please enter a valid email address', 'error');
    return false;
  }
  
  // Validate mobile number (Bangladeshi format: 01XXXXXXXXX)
  const mobileRegex = /^01[3-9]\d{8}$/;
  if (!mobileRegex.test(formData.mobile)) {
    showStatus('Please enter a valid Bangladeshi mobile number (e.g., 01712345678)', 'error');
    return false;
  }
  
  return true;
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load saved data for all sections
  loadPersonalInfo();
  loadAddressInfo();
  loadAcademicInfo();
  
  // Section elements
  const personalForm = document.getElementById('personalInfoForm');
  const addressSection = document.getElementById('addressSection');
  const academicForm = document.getElementById('academicForm');

  // Personal info save button
  const personalBtn = document.getElementById('savePersonalBtn');
  personalBtn.addEventListener('click', function() {
    const formData = collectData(personalForm);
    const formElements = personalForm.elements;
    
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      if (element.name || element.id) {
        const key = element.name || element.id;
        if (element.type === 'checkbox') {
          formData[key] = element.checked;
        } else if (element.type !== 'submit' && element.type !== 'button') {
          formData[key] = element.value;
        }
      }
    }
    if (validateFormData(formData)) {
      savePersonalInfo(formData);
    }
  });
  
  // Address info save button
  const addressBtn = document.getElementById('saveAddressBtn');
  addressBtn.addEventListener('click', function(){
    const data = collectData(addressSection);
    saveAddressInfo(data);
  });

  // Academic info save button
  const academicBtn = document.getElementById('saveAcademicBtn');
  academicBtn.addEventListener('click', function(){
    if (!academicForm) {
      showStatus('Academic form not found!', 'error');
      return;
    }
    const data = collectData(academicForm);
    saveAcademicInfo(data);
  });

  // Reset button handler for personal info
  const resetButton = document.createElement('button');
  resetButton.type = 'button';
  resetButton.textContent = 'Reset to Default';
  resetButton.style.marginTop = '10px';
  resetButton.style.backgroundColor = '#f44336';
  resetButton.style.width = '100%';
  resetButton.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset all fields to default values?')) {
      // Clear the storage and reload default values
      chrome.storage.sync.remove('personalInfo', function() {
        loadPersonalInfo();
        showStatus('Form reset to default values', 'info');
      });
    }
  });
  
  // Add the reset button after the form
  personalForm.parentNode.appendChild(resetButton);
});