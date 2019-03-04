var BASE_URL_API = "https://sk5xigrxfc.execute-api.ap-southeast-1.amazonaws.com/prod";

var url_string = window.location.href;
var url = new URL(url_string);
var DOC_ID = url.searchParams.get("id");

// Retrive Data
if (DOC_ID !== null) {

    var url = `${BASE_URL_API}/attendee?id=${ DOC_ID }`
    axios.get(url)
        .then(function (response) {
            // handle success
            editData(response.data.result);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}


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
        getOrientation(file[0], function (orientation) {
        if (file && file[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                // Delete
                resetOrientation(e.target.result, orientation, function(resetBase64Image) {
                    // resetImage.src = resetBase64Image;
                    // Delte
                    var previewImg = $(fileInput).parents('.file-upload-wrapper').siblings('.preview');
                    var img = $(previewImg).find('img');

                    if (img.length == 0) {
                        $(previewImg).html('<img src="' + resetBase64Image + '" alt=""/>');
                    } else {
                        img.attr('src', resetBase64Image);
                    }

                    uploadText.val(path);
                    maskImgs();
                });
                // // Delte
                // var previewImg = $(fileInput).parents('.file-upload-wrapper').siblings('.preview');
                // var img = $(previewImg).find('img');

                // if (img.length == 0) {
                //     $(previewImg).html('<img src="' + e.target.result + '" alt=""/>');
                // } else {
                //     img.attr('src', e.target.result);
                // }

                // uploadText.val(path);
                // maskImgs();
            }

            reader.onloadstart = function () {
                $(uploadText).val('uploading..');
            }

            reader.readAsDataURL(file[0]);
        }
        });
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

    // State
    var state_profile = 1;
    var state_resume = 1;
    var state_post = 0;


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
    data.age = parseInt(data.age);

    if (profileImg !== undefined) {
        state_profile = 0;
        data.profilepic_filename = data.id + '/profilepic_' + SEC_TIMESTAMP + '.' + profileImg.name.split('.').pop();
        var url = `${BASE_URL_API}/attendee-file/${data.profilepic_filename}`;
        axios.put(url, profileImg, {
            headers: {
                'Content-Type': profileImg.type // MIME Type
            }
        }).then(function (response) {
            console.log('Upload completed : ' + data.profilepic_filename);
            state_profile = 1;
            isLoading(state_profile, state_resume, state_post);
        }).catch(function (error) {
            console.log(error);
        })
    } else {
        var text = $("#profile_name").attr("placeholder");
        if (text != "รูปโปรไฟล์") {
            data.profilepic_filename = text;
        }
    }
    if (resume !== undefined) {

        state_resume = 0;
        data.resume_filename = data.id + '/resume_' + SEC_TIMESTAMP + '.' + resume.name.split('.').pop();
        var url = `${BASE_URL_API}/attendee-file/${data.resume_filename}`
        axios.put(url, resume, {
            headers: {
                'Content-Type': resume.type // MIME Type
            }
        }).then(function (response) {
            console.log('Upload completed : ' + data.resume_filename);
            state_resume = 1;
            isLoading(state_profile, state_resume, state_post);
        }).catch(function (error) {
            console.log(error);
        })
    } else {
        var text = $("#filename").html();
        if (text != "") {
            data.resume_filename = text;
        }
    }

    var isCheck = $('#is_new_graduated').is(':checked');
    if (!isCheck) {
        data.is_new_graduated = 0;
    } else {
        data.is_new_graduated = parseInt(data.is_new_graduated);
    }


    // Remove "" value 
    Object.keys(data).forEach((key) => (data[key].length == 0) && delete data[key]);
    
   
    axios.post(BASE_URL_API + '/attendee/', data)
        .then(function (response) {
            state_post = 1;
            isLoading(state_profile, state_resume, state_post);
        })
        .catch(function (error) {
            console.log(error);
        });

});

function isLoading(state1, state2, state3) { 
    console.log(state1,'1');
    console.log(state2,'2');
    console.log(state3, '3');
    var btn__submit = $('button[type=submit]');
    if (state1 == 1 && state2 == 1 && state3 == 1) { 
        btn__submit.removeClass("is-loading");
        showDialog();
    }else {
        return;
    }
}

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




function closeDialog() {
    $("#dialog").removeClass("is-active");
}

function showDialog() {
    $("#dialog").addClass("is-active");
}


function editData(data) {

    Object.keys(data).forEach(function (key) {

        if (key == 'profilepic_filename') {

            $("#profile_picture").css("background-image", "url(" + BASE_URL_API + "/attendee-file/" + data[key] + ")");
            $("#profile_name").attr("placeholder", data[key]);

        } else if (key == 'resume_filename') {

            $("#filename").html(data[key]);

        } else if (key == 'is_new_graduated') {
            if (data[key] == 1) {

                $('#is_new_graduated').attr('checked', true); // "checked"
                $("#interest_job").attr("disabled", true);

            }
        } else if (key == 'gender') {

            $('input[name="gender"][value=' + data[key] + ']').attr('checked', 'checked');
        } else {
            var elem = $("[name=" + key + "]");
            if (elem.length !== 0) {
                elem.val(data[key]);
            }
        }
    });

}



// Fix EX// from http://stackoverflow.com/a/32490603
function getOrientation(file, callback) {
    var reader = new FileReader();

    reader.onload = function (event) {
        var view = new DataView(event.target.result);

        if (view.getUint16(0, false) != 0xFFD8) return callback(-2);

        var length = view.byteLength,
            offset = 2;

        while (offset < length) {
            var marker = view.getUint16(offset, false);
            offset += 2;

            if (marker == 0xFFE1) {
                if (view.getUint32(offset += 2, false) != 0x45786966) {
                    return callback(-1);
                }
                var little = view.getUint16(offset += 6, false) == 0x4949;
                offset += view.getUint32(offset + 4, little);
                var tags = view.getUint16(offset, little);
                offset += 2;

                for (var i = 0; i < tags; i++)
                    if (view.getUint16(offset + (i * 12), little) == 0x0112)
                        return callback(view.getUint16(offset + (i * 12) + 8, little));
            } else if ((marker & 0xFF00) != 0xFF00) break;
            else offset += view.getUint16(offset, false);
        }
        return callback(-1);
    };
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
};



function resetOrientation(srcBase64, srcOrientation, callback) {
	var img = new Image();	

	img.onload = function() {
  	var width = img.width,
    		height = img.height,
        canvas = document.createElement('canvas'),
	  		ctx = canvas.getContext("2d");
		
    // set proper canvas dimensions before transform & export
		if (4 < srcOrientation && srcOrientation < 9) {
    	canvas.width = height;
      canvas.height = width;
    } else {
    	canvas.width = width;
      canvas.height = height;
    }
	
  	// transform context before drawing image
	switch (srcOrientation) {
      case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
      case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
      case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
      case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
      case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
      case 7: ctx.transform(0, -1, -1, 0, height , width); break;
      case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
      default: break;
    }

		// draw image
    ctx.drawImage(img, 0, 0);

		// export base64
		callback(canvas.toDataURL());
  };

	img.src = srcBase64;
}


