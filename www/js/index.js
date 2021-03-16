document.addEventListener('deviceready', onDeviceReady, false);
var db;
var pictureSource;   // picture source
var destinationType; // sets the format of returned value

function onDeviceReady() {
    console.log('Populating Database ...');
    connectDatabase();
    populateDatabase();

    initTwitter();
    postTwitter();

    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;

    console.log('Ready ...');
}

function connectDatabase() {
    db = window.openDatabase("iDiscovery-Database", "1.0", "iDiscovery", 200000);
}

function populateDatabase() {
    db.transaction(populateTables, error, success);
}

function initTwitter() {
    twitter.init({
        consumerKey: "B9H8PWpFEjGT96XxPDQ6I9NIZ",
        consumerSecret: "FRKBod1AzYuFITLsOklOYBMKtTCIfkabS5HPRaCmAPqJ4a93r1",
        callbackUrl: "http://172.20.10.2:3000"
    });
}

function postTwitter() {
    twitter.login(function(token) {
        console.log(token);
        twitter.postTweet({
                message: "I am tweeting using Twitter Phonegap Plugin"
            },
            function() {
                alert("tweet successful");
            },
            function(e) {
                alert("error occurred while tweeting");
            });
    }, function(e) {
        alert(e);
    });
}

function loadVerifyActivity() {
    var activityName = $('#activityName').val();
    var activityLocation = $('#activityLocation').val();
    var activityDate = $('#activityDate').val();
    var activityTime = $('#activityTime').val();
    var activityReporter = $('#activityReporter').val();
    var activityReport = $('#activityReport').val();
    setActivityDetails(activityName, activityLocation, activityDate, activityTime, activityReporter, activityReport);
    window.location.href = 'verify-activity.html';
}

function loadUpdateActivity() {
    var activityName = $('#activityName').val();
    var activityLocation = $('#activityLocation').val();
    var activityDate = $('#activityDate').val();
    var activityTime = $('#activityTime').val();
    var activityReporter = $('#activityReporter').val();
    var activityReport = localStorage.getItem("activityReport");
    setActivityDetails(activityName, activityLocation, activityDate, activityTime, activityReporter, activityReport);
    window.location.href = 'update-activity.html';
}

function loadDashboard() {
    removeActivityDetails();
    removeActivitySearchDetails();
    removeActivityPhotos();
    location.href='index.html';
}

function loadAddEditActivity() {

    location.href='add-activity.html';
}

function loadEditActivity() {
    location.href='edit-activity.html';
}

function loadActivityReport() {
    var activityName = $('#activityName').val();
    var activityLocation = $('#activityLocation').val();
    var activityDate = $('#activityDate').val();
    var activityTime = $('#activityTime').val();
    var activityReporter = $('#activityReporter').val();
    var activityReport = localStorage.getItem("activityReport");
    setActivityDetails(activityName, activityLocation, activityDate, activityTime, activityReporter, activityReport);
    location.href='report-activity.html';
}

function deleteActivity() {
    event.preventDefault();
    connectDatabase();
    db.transaction(deleteSelectedActivity, error);
}

function loadViewActivity(activityId) {
    localStorage.setItem("activityId", activityId);
    loadSavedActivityDetails();
}

function loadAddActivity() {
    removeActivityDetails();
    removeActivitySearchDetails();
    removeActivityPhotos();
    location.href='add-activity.html';
}

function loadAllActivities() {
    removeActivityDetails();
    removeActivitySearchDetails();
    removeActivityPhotos();
    location.href='view-all-activity.html';
}

function loadSearchedActivities() {
    removeActivityDetails();
    location.href='view-all-activity.html';
}

function loadSearchActivities() {
    removeActivityDetails();
    removeActivitySearchDetails();
    removeActivityPhotos();
    location.href='search-activity.html ';
}

function loadSearchAgainActivities() {
    location.href='search-activity.html ';
}

function getAllActivities() {
    connectDatabase();
    var activityName = localStorage.getItem("activityNameSearch");
    var activityDate = localStorage.getItem("activityDateSearch");
    var activityReporter = localStorage.getItem("activityReporterSearch");

    if (activityName === "" || activityName === "null") {
        activityName = null;
    }
    if (activityDate === "" || activityDate === "null") {
        activityDate = null;
    }
    if (activityReporter === "" || activityReporter === "null") {
        activityReporter = null;
    }
    if (activityName == null && activityDate == null && activityReporter == null) {
        $("#searchCriteria").hide();
        $("#controllers").show();
        db.transaction(selectAllActivities, error);
    } else {
        if(activityName == null) {
            activityName = "";
        }
        if(activityDate == null) {
            activityDate = "";
        }
        if(activityReporter == null) {
            activityReporter = "";
        }
        localStorage.setItem("activityNameSearch", activityName);
        localStorage.setItem("activityDateSearch", activityDate);
        localStorage.setItem("activityReporterSearch", activityReporter);

        $("#searchCriteria").show();
        $("#controllers").hide();
        loadActivitySearchDetails();
        db.transaction(searchAllActivities, error);
    }
}

function loadActivityTable(results) {
    console.log("Record Count = " + results.rows.length);
    var content = "";

    if (results.rows.length === 0) {
        content += "<tr><td colspan='4'>No Data Available</td></tr>";
    }

    for(i=0; i<results.rows.length; i++){
        content += "<tr><td>" + results.rows.item(i).activity_name + "</td>";
        content += "<td>" + results.rows.item(i).activity_date + "</td>";
        content += "<td>" + results.rows.item(i).activity_reporter + "</td>";
        content += "<td><a href='#' onclick='loadViewActivity(" + results.rows.item(i).id + ")' class='btn btn-info btn-circle'><i class='fa fa-eye'></i></a></td></tr>";
    }

    $('#all').append(content);
}

function loadActivitySavedDetails(results) {
    var activityReport = results.rows.item(0).activity_report;
    if(activityReport === 'undefined') {
        activityReport = "";
    }

    console.log(results.rows.item(0).id);
    setActivityDetails(results.rows.item(0).activity_name, results.rows.item(0).activity_location, results.rows.item(0).activity_date,
        results.rows.item(0).activity_time, results.rows.item(0).activity_reporter, activityReport);

    db.transaction(selectActivityPhotos, error);
}

function loadActivityPhotosSavedDetails(results) {
    for (var i = 0; i < results.rows.length; i++) {
        setActivityPhotosDetails("image" + i, results.rows.item(i).activity_photo);
    }
    location.href='view-activity.html';
}

function saveActivityReport() {
    localStorage.setItem("activityReport", $('#activityReport').val());

    localStorage.setItem("image0", localStorage.getItem("tempImage0"));
    localStorage.setItem("image1", localStorage.getItem("tempImage1"));
    localStorage.setItem("image2", localStorage.getItem("tempImage2"));
    localStorage.setItem("image3", localStorage.getItem("tempImage3"));
    localStorage.setItem("image4", localStorage.getItem("tempImage4"));

    loadEditActivity();
}

function setActivityDetails(activityName, activityLocation, activityDate, activityTime, activityReporter, activityReport) {
    localStorage.setItem("activityName", activityName);
    localStorage.setItem("activityLocation", activityLocation);
    localStorage.setItem("activityDate", activityDate);
    localStorage.setItem("activityTime", activityTime);
    localStorage.setItem("activityReporter", activityReporter);
    localStorage.setItem("activityReport", activityReport);
}

function setActivityPhotosDetails(imageId, imageData) {
    localStorage.setItem(imageId, imageData);
}

function loadActivityDetails() {
    $('#activityId').val(localStorage.getItem("activityId"));
    $('#activityName').val(localStorage.getItem("activityName"));
    $('#activityLocation').val(localStorage.getItem("activityLocation"));
    $('#activityDate').val(localStorage.getItem("activityDate"));
    $('#activityTime').val(localStorage.getItem("activityTime"));
    $('#activityReporter').val(localStorage.getItem("activityReporter"));
    $('#activityReport').val(localStorage.getItem("activityReport"));
}

function loadActivityPhotos() {
    var imageData0 = localStorage.getItem("image0");
    var imageData1 = localStorage.getItem("image1");
    var imageData2 = localStorage.getItem("image2");
    var imageData3 = localStorage.getItem("image3");
    var imageData4 = localStorage.getItem("image4");

    if (imageData0 === "null") {
        imageData0 = null;
    }
    if (imageData1 === "null") {
        imageData1 = null;
    }
    if (imageData2 === "null") {
        imageData2 = null;
    }
    if (imageData3 === "null") {
        imageData3 = null;
    }
    if (imageData4 === "null") {
        imageData4 = null;
    }

    if (imageData0 != null) {
        var image0 = document.getElementById('image0');
        image0.style.display = 'block';
        image0.src = "data:image/jpeg;base64," + imageData0;
    }
    if (imageData1 != null) {
        var image1 = document.getElementById('image1');
        image1.style.display = 'block';
        image1.src = "data:image/jpeg;base64," + imageData1;
    }
    if (imageData2 != null) {
        var image2 = document.getElementById('image2');
        image2.style.display = 'block';
        image2.src = "data:image/jpeg;base64," + imageData2;
    }
    if (imageData3 != null) {
        var image3 = document.getElementById('image3');
        image3.style.display = 'block';
        image3.src = "data:image/jpeg;base64," + imageData3;
    }
    if (imageData4 != null) {
        var image4 = document.getElementById('image4');
        image4.style.display = 'block';
        image4.src = "data:image/jpeg;base64," + imageData4;
    }
}

function loadActivitySearchDetails() {
    $('#activityName').val(localStorage.getItem("activityNameSearch"));
    $('#activityDate').val(localStorage.getItem("activityDateSearch"));
    $('#activityReporter').val(localStorage.getItem("activityReporterSearch"));
}

function loadSavedActivityDetails() {
    connectDatabase();
    db.transaction(selectActivity, error);
}

function removeActivityDetails() {
    localStorage.removeItem("activityId");
    localStorage.removeItem("activityName");
    localStorage.removeItem("activityLocation");
    localStorage.removeItem("activityDate");
    localStorage.removeItem("activityTime");
    localStorage.removeItem("activityReporter");
    localStorage.removeItem("activityReport");
}

function removeActivitySearchDetails() {
    localStorage.removeItem("activityNameSearch");
    localStorage.removeItem("activityDateSearch");
    localStorage.removeItem("activityReporterSearch");
}

function removeActivityPhotos() {
    localStorage.removeItem("tempImage0");
    localStorage.removeItem("tempImage1");
    localStorage.removeItem("tempImage2");
    localStorage.removeItem("tempImage3");
    localStorage.removeItem("tempImage4");
    localStorage.removeItem("image0");
    localStorage.removeItem("image1");
    localStorage.removeItem("image2");
    localStorage.removeItem("image3");
    localStorage.removeItem("image4");
}

function saveActivity(activityName, activityDate) {
    connectDatabase();
    validateActivity(activityName, activityDate);
}

function updateActivity(activityName, activityDate) {
    connectDatabase();
    validateActivity(activityName, activityDate);
}

function validateActivity(activityName, activityDate) {
    localStorage.setItem("activityNameSearch", activityName);
    localStorage.setItem("activityDateSearch", activityDate);
    db.transaction(validateSavedActivity, error);
}

function activityExistsNew(results) {
    if (results.rows.length > 0) {
        alert("Activity exists for entered Name and Date");
    } else {
        db.transaction(insertActivity, error);
    }
}

function activityExistsUpdate(results) {
    if (results.rows.length > 0) {
        alert("Activity exists for entered Name and Date");
    } else {
        db.transaction(updateSelectedActivity, error);
    }
}

function searchActivity(activityName, activityDate, activityReporter) {
    localStorage.setItem("activityNameSearch", activityName);
    localStorage.setItem("activityDateSearch", activityDate);
    localStorage.setItem("activityReporterSearch", activityReporter);
    location.href='view-all-activity.html';
}

var i = 0;

function onPhotoDataSuccess(imageData) {
    var smallImage = document.getElementById('image' + i);
    smallImage.style.display = 'block';
    smallImage.src = "data:image/jpeg;base64," + imageData;
    localStorage.setItem("tempImage" + i, imageData);
    i++;
}

function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: false,
        destinationType: navigator.camera.DestinationType.DATA_URL });
}

function onFail(message) {
    alert(message);
}

function openMaps() {
    var activityLocation = $('#activityLocation').val();
    window.open('https://www.google.com/maps/place/' + activityLocation , '_system');
}

