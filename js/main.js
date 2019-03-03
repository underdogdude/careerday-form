var BASE_URL_API = "https://sk5xigrxfc.execute-api.ap-southeast-1.amazonaws.com/prod";


$("#is_new_graduated").change(function () {
    if (this.checked) {
        //Do stuff
        $("#interest_job").attr("disabled", true);
    } else {
        $("#interest_job").attr("disabled", false);
    }
});

// Show File name
var file = document.getElementById("resume");
file.onchange = function () {
    // Check File Size
    checkMaxUploadSize(this.id)
    if (file.files.length > 0) {
        document.getElementById('filename').innerHTML = file.files[0].name;
    }
};

function checkMaxUploadSize(id) {
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


$("#attendee_form").submit(function (e) {

    e.preventDefault();
    // Loading
    var btn__submit = $('button[type=submit]');
    btn__submit.addClass("is-loading");

    var data = {};
    var SEC_TIMESTAMP = Math.floor(Date.now() / 1000);
    var profileImg = document.querySelector('#profile').files[0];
    var resume = document.querySelector('#resume').files[0];

    $(this).serializeArray().map(function (x) {
        data[x.name] = x.value;
    });
    
    //4 is length of ID
    data.id = generateID(4) + SEC_TIMESTAMP;

    if (profileImg !== undefined) {
        data.profilepic_filename = 'profilepic_' + SEC_TIMESTAMP + '.' + profileImg.name.split('.').pop();

        var url = `${BASE_URL_API}/attendee-file/${data.id}/${data.profilepic_filename}`
        axios.put(url, profileImg, {
            headers: {
                'Content-Type': profileImg.type // MIME Type
            }
        }).then(function (response) {
            console.log('Upload completed : ' + data.profilepic_filename);
        }).catch(function (error) {
            console.log(error);
        })
    }

    if (resume !== undefined) {
        data.resume_filename = 'resume_' + SEC_TIMESTAMP + '.' + resume.name.split('.').pop();

        var url = `${BASE_URL_API}/attendee-file/${data.id}/${data.resume_filename}`
        axios.put(url, resume, {
            headers: {
                'Content-Type': resume.type // MIME Type
            }
        }).then(function (response) {
            console.log('Upload completed : ' + data.resume_filename);
        }).catch(function (error) {
            console.log(error);
        })
    }


    axios.post(BASE_URL_API + '/attendee/', data)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });

});



function generateID(plength) {

    var keylistalpha = "abcdefghijklmnopqrstuvwxyz";
    var keylistint = "123456789";
    var keylistspec = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
    var temp = '';
    var len = plength / 2;
    var len = len - 1;
    var lenspec = plength - len - len;

    for (i = 0; i < len; i++)
        temp += keylistalpha.charAt(Math.floor(Math.random() * keylistalpha.length));

    for (i = 0; i < lenspec; i++)
        temp += keylistspec.charAt(Math.floor(Math.random() * keylistspec.length));

    for (i = 0; i < len; i++)
        temp += keylistint.charAt(Math.floor(Math.random() * keylistint.length));

    temp = temp.split('').sort(function () {
        return 0.5 - Math.random()
    }).join('');

    return temp;
}