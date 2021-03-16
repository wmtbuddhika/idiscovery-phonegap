function populateTables(tx) {
    // tx.executeSql('DROP TABLE IF EXISTS activity');
    tx.executeSql('CREATE TABLE IF NOT EXISTS activity (id INTEGER PRIMARY KEY, activity_name, activity_location, activity_date, activity_time, activity_reporter, activity_report)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS activity_photos (id INTEGER PRIMARY KEY, activity_id, activity_photo)');
}

function error(err) {
    console.log("Error processing SQL : " + err.message);
}

function success() {
    console.log("Success");
}

function insertActivitySuccess() {
    console.log("Activity Inserted Successfully");
    alert("Activity Inserted Successfully");
    loadDashboard();
}

function insertActivityPhotoSuccess() {
    console.log("Activity Photo Inserted Successfully");
}

function updateActivitySuccess() {
    console.log("Activity Updated Successfully");
    alert("Activity Updated Successfully");
    loadAllActivities();
}

function deleteActivitySuccess() {
    console.log("Activity Deleted Successfully");
    alert("Activity Deleted Successfully");
    loadAllActivities();
}

function deleteActivityPhotosSuccess() {
    console.log("Activity Photos Deleted Successfully");
}

function insertActivity(tx) {
    var activityName = localStorage.getItem("activityName");
    var activityLocation = localStorage.getItem("activityLocation");
    var activityDate = localStorage.getItem("activityDate");
    var activityTime = localStorage.getItem("activityTime");
    var activityReporter = localStorage.getItem("activityReporter");
    var activityReport = localStorage.getItem("activityReport");
    tx.executeSql('INSERT INTO activity (activity_name, activity_location, activity_date, activity_time, activity_reporter, activity_report) VALUES (?, ?, ?, ?, ?, ?)',
        [activityName, activityLocation, activityDate, activityTime, activityReporter, activityReport], insertActivitySuccess, error);
}

function updateSelectedActivity(tx) {
    var activityId = localStorage.getItem("activityId");
    var activityName = localStorage.getItem("activityName");
    var activityLocation = localStorage.getItem("activityLocation");
    var activityDate = localStorage.getItem("activityDate");
    var activityTime = localStorage.getItem("activityTime");
    var activityReporter = localStorage.getItem("activityReporter");
    var activityReport = localStorage.getItem("activityReport");

    var image0 = localStorage.getItem("image0");
    var image1 = localStorage.getItem("image1");
    var image2 = localStorage.getItem("image2");
    var image3 = localStorage.getItem("image3");
    var image4 = localStorage.getItem("image4");

    var query = '';
    var param = [];

    if (image0 !== 'null') {
        query = 'INSERT INTO activity_photos (activity_id, activity_photo) VALUES (?, ?) ';
        param = [activityId, image0];
    }
    if (image1 !== 'null') {
        query += ', (?, ?) ';
        param.push(activityId, image1);
    }
    if (image2 !== 'null') {
        query += ', (?, ?) ';
        param.push(activityId, image2);
    }
    if (image3 !== 'null') {
        query += ', (?, ?) ';
        param.push(activityId, image3);
    }
    if (image4 !== 'null') {
        query += ', (?, ?) ';
        param.push(activityId, image4);
    }

    tx.executeSql(query, param, insertActivityPhotoSuccess, error);

    tx.executeSql('UPDATE activity SET activity_name = ?, activity_location = ?, activity_date = ?, activity_time = ?, activity_reporter = ?, activity_report = ? ' +
        'WHERE id = ?',
        [activityName, activityLocation, activityDate, activityTime, activityReporter, activityReport, activityId], updateActivitySuccess, error);

    // tx.executeSql('DELETE FROM activity_photos WHERE activity_id = ?', [activityId], deleteActivityPhotosSuccess, error);
}

function deleteSelectedActivity(tx) {
    var activityId = localStorage.getItem("activityId");

    tx.executeSql('DELETE FROM activity_photos WHERE activity_id = ?', [activityId], deleteActivityPhotosSuccess, error);
    tx.executeSql('DELETE FROM activity WHERE id = ?', [activityId], deleteActivitySuccess, error);
}

function selectAllActivities(tx) {
    tx.executeSql('SELECT * FROM activity ', [], allActivities, error);
}

function searchAllActivities(tx) {
    var activityNameSearch = localStorage.getItem("activityNameSearch");
    var activityDateSearch = localStorage.getItem("activityDateSearch");
    var activityReporterSearch = localStorage.getItem("activityReporterSearch");
    var activityName = "%" + activityNameSearch + "%";
    var activityDate = "%" + activityDateSearch + "%";
    var activityReporter = "%" + activityReporterSearch + "%";
    tx.executeSql('SELECT * FROM activity WHERE activity_name LIKE ? AND activity_date LIKE ? AND activity_reporter LIKE ? ',
        [activityName, activityDate, activityReporter], allActivities, error);
}

function validateSavedActivity(tx) {
    var activityId = localStorage.getItem("activityId");
    var activityNameSearch = localStorage.getItem("activityNameSearch");
    var activityDateSearch = localStorage.getItem("activityDateSearch");
    var activityName = "%" + activityNameSearch + "%";
    var activityDate = "%" + activityDateSearch + "%";

    var sql = 'SELECT * FROM activity WHERE activity_name LIKE ? AND activity_date LIKE ? ';
    var param = [activityName, activityDate];

    if (activityId != null) {
        sql += 'AND activity_id != ? ';
        param.push(activityId);
        tx.executeSql(sql, param, validateUpdateActivity, error);
    } else {
        tx.executeSql(sql, param, validateNewActivity, error);
    }
}

function allActivities(tx, results) {
    loadActivityTable(results);
}

function validateNewActivity(tx, results) {
    activityExistsNew(results);
}

function validateUpdateActivity(tx, results) {
    activityExistsUpdate(results);
}

function selectActivity(tx) {
    var activityId = localStorage.getItem("activityId");
    tx.executeSql('SELECT * FROM activity WHERE id = ? ', [activityId], activityDetails, error);
}

function selectActivityPhotos(tx) {
    var activityId = localStorage.getItem("activityId");
    tx.executeSql('SELECT * FROM activity_photos WHERE activity_id = ? ', [activityId], activityPhotosDetails, error);
}

function activityDetails(tx, results) {
    loadActivitySavedDetails(results);
}

function activityPhotosDetails(tx, results) {
    loadActivityPhotosSavedDetails(results);
}
