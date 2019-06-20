$(document).ready(function () {
  $('#open-photo').click(function () {
    $('#add-photo').modal({
      fadeDuration: 250,
      fadeDelay: 0.80,
      showClose: false,
    });
  })

  $('.cancel').click(function () {
    $.modal.close();
  })

  const isAdvancedUpload = function () {
    const div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
  }();

  const $fileForm = $('.box');
  if (isAdvancedUpload) {
    $fileForm.addClass('has-advanced-upload');
    let droppedFiles = false;
    const $input = $fileForm.find('input[type="file"]'),
      $label = $fileForm.find('label[for="file"]'),
      showFiles = function (files) {
        $label.text(files[0].name);
      };

    $input.on('change', function (e) {
      showFiles(e.target.files);
    });

    $fileForm.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
    })
      .on('dragover dragenter', function () {
        $fileForm.addClass('is-dragover');
      })
      .on('dragleave dragend drop', function () {
        $fileForm.removeClass('is-dragover');
      })
      .on('drop', function (e) {
        droppedFiles = e.originalEvent.dataTransfer.files; // the files that were dropped
        console.log('dropped files is', droppedFiles);
        showFiles(droppedFiles);
      });

    $fileForm.on('submit', function (e) {
      if ($fileForm.hasClass('is-uploading')) return false;

      $fileForm.addClass('is-uploading').removeClass('is-error');
      let fileName;
      if (isAdvancedUpload) {
        e.preventDefault();
        const ajaxData = new FormData();

        if (droppedFiles) {
          fileName = droppedFiles[0].name
          ajaxData.append('filename', fileName);
        }



        // smelly! I would defiitely like time to refactor this from a functional approach.
        ajaxData.append('photoTitle', $('input#name').val())
        ajaxData.append('description', $('input#description').val())
        ajaxData.append('license', $('input#license').val())
        ajaxData.append('depicts', $('input#depicts').val())

        $.ajax({
          url: $fileForm.attr('action'),
          type: $fileForm.attr('method'),
          data: ajaxData,
          dataType: 'json',
          cache: false,
          contentType: false,
          processData: false,
          complete: function () {
            $fileForm.removeClass('is-uploading');
          },
          success: function (data) {
            $fileForm.addClass(data.success == true ? 'is-success' : 'is-error');
            if (!data.success) $errorMsg.text(data.error);
            $.modal.close();
            $('#select-section').addClass("on");
          },
          error: function (data) {
            alert('error: ', data);
          }
        });


        $("section").click(function (e) {
          const ajaxDataLocation = {
            "fileName": fileName,
            "selectedLocation": $(this).attr("id"),

          }
          console.log($(this).attr("id"));
          $.ajax({
            url: '/upload/photo/location',
            type: 'PUT',
            data: JSON.stringify(ajaxDataLocation),
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
              $("section").off("click");
              $('#select-section').addClass('success').text('Success - thank you!');
              setTimeout(function () {
                $('#select-section').removeClass("on");
              }, 2000)
            },
            error: function (data) {
              alert('error: ', data);
            }
          });

        });


      } else {
        const iframeName = 'uploadiframe' + new Date().getTime();
        $iframe = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

        $('body').append($iframe);
        $fileForm.attr('target', iframeName);

        $iframe.one('load', function () {
          const data = JSON.parse($iframe.contents().find('body').text());
          $fileForm
            .removeClass('is-uploading')
            .addClass(data.success == true ? 'is-success' : 'is-error')
            .removeAttr('target');
          if (!data.success) $errorMsg.text(data.error);
          $fileForm.removeAttr('target');
          $iframe.remove();
        });
      }



    });



  }
});
