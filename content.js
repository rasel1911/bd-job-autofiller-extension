
window.addEventListener("message", async (event) => {
  if (event.source !== window || event.data.type !== "START_FILLING") return;

  console.log("Starting form auto-fill...");
  
  // Get personal info from Chrome storage
  let personalInfo = {};
  try {
    const result = await chrome.storage.sync.get('personalInfo');
    personalInfo = result.personalInfo || {};
    console.log('Retrieved personal info:', personalInfo);
    
    if (Object.keys(personalInfo).length === 0) {
      console.warn('No personal info found in storage. Please set your information in the extension options.');
      return;
    }
  } catch (error) {
    console.error('Error retrieving personal info from storage:', error);
    return;
  }
  let academicInfo = {};
  try {
    const result = await chrome.storage.sync.get('academicInfo');
    academicInfo = result.academicInfo || {};
    console.log('Retrieved academic info:', academicInfo);

    if (Object.keys(academicInfo).length === 0) {
      console.warn('No academic info found in storage. Please set your information in the extension options.');
      return;
    }
  } catch (error) {
    console.error('Error retrieving academic info from storage:', error);
    return;
  }
  console.log("rasel academic",academicInfo);
  
  let addressInfo = {};
  try {
    const result = await chrome.storage.sync.get('addressInfo');
    addressInfo = result.addressInfo || {};
    console.log('Retrieved address info:', addressInfo);

    if (Object.keys(addressInfo).length === 0) {
      console.warn('No academic info found in storage. Please set your information in the extension options.');
      return;
    }
  } catch (error) {
    console.error('Error retrieving academic info from storage:', error);
    return;
  }
  console.log("rasel address",addressInfo);

  console.log(personalInfo, academicInfo, addressInfo);
  function selectInfo(name, val){
    setTimeout(() => {
    const rel = document.getElementById(name);
    rel.value = val;
    rel.dispatchEvent(new Event('change', { bubbles: true }));
  }, 100);
  }

  await new Promise(r => setTimeout(r, 2000));

  document.getElementById("name").value = personalInfo.name;
  document.getElementById("name_bn").value = personalInfo.name_bn;
  document.getElementById("father").value = personalInfo.father;
  document.getElementById("father_bn").value = personalInfo.father_bn;
  document.getElementById("mother").value = personalInfo.mother;
  document.getElementById("mother_bn").value = personalInfo.mother_bn;
  document.getElementById("dob").value = personalInfo.dob;
  selectInfo("religion",personalInfo.religion)
  selectInfo("gender",personalInfo.gender)

  setTimeout(() => {
    const select = document.getElementById("nid");
    select.value = 1;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, 1000);
  document.getElementById("nid_no").value = personalInfo.nid_no;
  document.getElementById("mobile").value = personalInfo.mobile;
  document.getElementById("breg").value = 0;
  document.getElementById("passport").value =0;
  document.getElementById("confirm_mobile").value = personalInfo.mobile;
  document.getElementById("email").value = personalInfo.email;
  document.getElementById("marital_status").value = personalInfo.marital;
  document.getElementById("quota").value = 8;
  document.getElementById("dep_status").value = 5;

  // academic info
  selectInfo("ssc_exam",academicInfo.ssc_exam)
  selectInfo("ssc_roll",academicInfo.ssc_roll)
  selectInfo("ssc_group",academicInfo.ssc_group)
  selectInfo("ssc_board",academicInfo.ssc_board)
  selectInfo("ssc_result_type",academicInfo.ssc_result_type)
  document.getElementById("ssc_result").value = academicInfo.ssc_result;
  document.getElementById("ssc_year").value = academicInfo.ssc_year;
  try{
    selectInfo("hsc_exam",academicInfo.hsc_exam)
    selectInfo("hsc_roll",academicInfo.hsc_roll)
    selectInfo("hsc_group",academicInfo.hsc_group)
    selectInfo("hsc_board",academicInfo.hsc_board)
    selectInfo("hsc_result_type",academicInfo.hsc_result_type)
    document.getElementById("hsc_result").value = academicInfo.hsc_result;
    document.getElementById("hsc_year").value = academicInfo.hsc_year;
  }catch(e){
    console.log(e);
  }
  try{
    selectInfo("gra_exam",academicInfo.gra_exam)
    selectInfo("gra_institute",academicInfo.gra_institute)
    selectInfo("gra_year",academicInfo.gra_year)
    selectInfo("gra_subject",academicInfo.gra_subject)
    selectInfo("gra_result_type",academicInfo.gra_result_type)
    document.getElementById("gra_result").value = academicInfo.gra_result;
    selectInfo("gra_duration",academicInfo.gra_duration)
  }catch(e){
    console.log(e);
  }


  // address info
  console.log("addressInfo_careoff",addressInfo.permanent_careof,addressInfo.present_village);
  document.getElementById("present_careof").value = addressInfo.permanent_careof;
  document.getElementById("present_village").value = addressInfo.permanent_village;
  selectInfo("present_district",addressInfo.permanent_district)
  selectInfo("present_upazila",addressInfo.permanent_upazila)
  document.getElementById("present_post").value = addressInfo.permanent_post;
  document.getElementById("present_postcode").value = addressInfo.permanent_postcode;

  console.log("Form filled!");
});
