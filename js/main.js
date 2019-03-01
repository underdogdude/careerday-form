


$("#is_new_graduated").change(function() {
    if(this.checked) {
        //Do stuff
        $("#interest_job").attr("disabled", true);
    }else {
        $("#interest_job").attr("disabled", false);
    }
});