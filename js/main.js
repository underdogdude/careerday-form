$("#is_new_graduated").change(function () {
    if (this.checked) {
        //Do stuff
        $("#interest_job").attr("disabled", true);
    } else {
        $("#interest_job").attr("disabled", false);
    }
});


// sample of usage api for upload

// var file = document.querySelector('input[type=file]').files[0];
// if (file) {
//     const base_url_api = '';
//     const filename = '';
//     const url = `${base_url_api}/${filename}`
//     axios.put(url, file, {
//         headers: {
//             'Content-Type': file.type // MIME Type
//         }
//     }).then(function (response) {
//         console.log('Upload completed : ' + filename);
//     }).catch(function (error) {
//         console.log(error);
//     })
// }


// Show File name
var file = document.getElementById("resume");
file.onchange = function () {
    // Check File Size
    checkMaxUploadSize(this.id)
    if (file.files.length > 0) {
        document.getElementById('filename').innerHTML = file.files[0].name;
    }
};

function checkMaxUploadSize (id) {
    var uploadField = document.getElementById(id);
    if (uploadField.files[0].size > 10000000) {
        alert("File is too big!");
        uploadField.value = "";
    };
}


// Upload Image
function maskImgs() {
    //$('.img-wrapper img').imagesLoaded({}, function() {
    $.each($('.img-wrapper img'), function (index, img) {
        var src = $(img).attr('src');
        var parent = $(img).parent();
        parent
            .css('background', 'url(' + src + ') no-repeat center center')
            .css('background-size', 'cover');
        $(img).remove();
    });
    //});
}
var preview = {
    init: function () {
        preview.setPreviewImg();
        preview.listenInput();
    },
    setPreviewImg: function (fileInput) {
        var path = $(fileInput).val();
        var uploadText = $(fileInput).siblings('.file-upload-text');

        if (!path) {
            $(uploadText).val('');
        } else {
            path = path.replace(/^C:\\fakepath\\/, "");
            $(uploadText).val(path);

            preview.showPreview(fileInput, path, uploadText);
        }
    },
    showPreview: function (fileInput, path, uploadText) {
        var file = $(fileInput)[0].files;

        if (file && file[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var previewImg = $(fileInput).parents('.file-upload-wrapper').siblings('.preview');
                var img = $(previewImg).find('img');

                if (img.length == 0) {
                    $(previewImg).html('<img src="' + e.target.result + '" alt=""/>');
                } else {
                    img.attr('src', e.target.result);
                }

                uploadText.val(path);
                maskImgs();
            }

            reader.onloadstart = function () {
                $(uploadText).val('uploading..');
            }

            reader.readAsDataURL(file[0]);
        }
    },
    listenInput: function () {
        $('.file-upload-native').on('change', function () {
            preview.setPreviewImg(this);
        });
    }
};
preview.init();