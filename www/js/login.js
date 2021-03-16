function Login(e) {
    $.ajax({
        type: "post",
        url: "http://localhost:3005/login",
        data: {'data':'data'},
        success: 'success',
        dataType: 'dataType'
    });
}
