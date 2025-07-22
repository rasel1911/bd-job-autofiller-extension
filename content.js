
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
  
  const academic_info = {
  ssc_exam: "1",
  ssc_roll: "158222",
  ssc_group: "1",
  ssc_board: "14",
  ssc_result_type: "5",
  ssc_result: "4.80",
  ssc_year: "2015",
  
  hsc_exam: "1",
  hsc_roll: "164178",
  hsc_group: "1",
  hsc_board: "14",
  hsc_result_type: "5",
  hsc_result: "4.75",
  hsc_year: "2017",

  gra_exam: "1",
  gra_institute: "273",
  gra_year: "2022",
  gra_subject: "306",
  gra_result_type: "4",
  gra_result: "3.22",
  gra_duration: "04",
  };

  const address_info = {
  present_careof: "Md. Rasel",
  present_village: "123/B, Fakirapool Road, Dhaka",
  present_district: "44",
  present_upazila: "376",
  present_post: "Melandaha",
  present_postcode: "1990"
  };
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
  selectInfo("ssc_exam",academic_info.ssc_exam)
  selectInfo("ssc_roll",academic_info.ssc_roll)
  selectInfo("ssc_group",academic_info.ssc_group)
  selectInfo("ssc_board",academic_info.ssc_board)
  selectInfo("ssc_result_type",academic_info.ssc_result_type)
  document.getElementById("ssc_result").value = academic_info.ssc_result;
  document.getElementById("ssc_year").value = academic_info.ssc_year;
  try{
    selectInfo("hsc_exam",academic_info.hsc_exam)
    selectInfo("hsc_roll",academic_info.hsc_roll)
    selectInfo("hsc_group",academic_info.hsc_group)
    selectInfo("hsc_board",academic_info.hsc_board)
    selectInfo("hsc_result_type",academic_info.hsc_result_type)
    document.getElementById("hsc_result").value = academic_info.hsc_result;
    document.getElementById("hsc_year").value = academic_info.hsc_year;
  }catch(e){
    console.log(e);
  }
  try{
    selectInfo("gra_exam",academic_info.gra_exam)
    selectInfo("gra_institute",academic_info.gra_institute)
    selectInfo("gra_year",academic_info.gra_year)
    selectInfo("gra_subject",academic_info.gra_subject)
    selectInfo("gra_result_type",academic_info.gra_result_type)
    document.getElementById("gra_result").value = academic_info.gra_result;
    selectInfo("gra_duration",academic_info.gra_duration)
  }catch(e){
    console.log(e);
  }


  // address info
  document.getElementById("present_careof").value = address_info.present_careof;
  document.getElementById("present_village").value = address_info.present_village;
  selectInfo("present_district",address_info.present_district)
  selectInfo("present_upazila",address_info.present_upazila)
  document.getElementById("present_post").value = address_info.present_post;
  document.getElementById("present_postcode").value = address_info.present_postcode;

  console.log("Form filled!");
});
