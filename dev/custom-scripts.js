$(document).ready(function() {
  
  //If there are custom content zones with empty containers, the zone is hidden from the page 
  $.each($('.content-zone .ms-rtestate-field'), function(index, value) {
    $(value).html() === '' ? $(value).parent().css('display', 'none') : '';
  });
  
  //Remove Recent from Left Nav
  $(".ms-core-listMenu-item:contains('Recent')").parent().remove();
  
  /**************************************************************************
                    Custom Side Nav Accordion Functionality
  **************************************************************************/
  
  if(window.location.href.indexOf('pulse') > -1) {
    
    if('#sideNavBox .ms-core-listMenu-root li.static ul.static li.selected') {
      var activeSideNavLink = $('#sideNavBox .ms-core-listMenu-root li.static ul.static li.static.selected');
      $(activeSideNavLink).parent().css('display', 'block');
      $(activeSideNavLink).parent().prev().addClass('active-menu');
    }

    $('#sideNavBox ul.ms-core-listMenu-root li>span.ms-core-listMenu-item').click(function() {
      
      if($(this).hasClass('active-menu')) {
        $(this).next().slideUp();
        $(this).removeClass('active-menu');
      } else {
        $('#sideNavBox ul.ms-core-listMenu-root li>span.ms-core-listMenu-item').next().slideUp();
        $('#sideNavBox ul.ms-core-listMenu-root li>span.ms-core-listMenu-item').removeClass('active-menu');
        $(this).next().slideDown();
        $(this).addClass('active-menu');
      }

    });
    
  }
  
  /**************************************************************************
                    Custom Photo Gallery ~jrahm
  **************************************************************************/
  
  var photoGallery = document.getElementsByClassName('photo-gallery');

  if(photoGallery.length === 0) {
    return;
  } else {
    var caption, currentThumb, selectedIndex, selectedFull, selectedPre, selectedThumb,
        captionSetting = $('.photo-gallery').attr('data-caption'),
        backdrop = '<div class="backdrop"></div>',
        fadeTimerShort = 250,
        fadeTimerMedium = 500,
        firstImage = $('.gallery-thumbnails img')[0],
        lightboxClose = '<span class="lightbox-close">X</span>',
        lightboxOpen = false,
        overlay = '<div class="overlay"></div>';
      
    //captionSetting === 'on' ? $('.gallery-preview').css('margin-bottom', '9rem') : '';
    
    //Called in the setImage function If image has alt text, use that as a caption, else no caption shows
    function getCaption(y) {
      if(captionSetting !== 'on') {
        return '';
      }
      if($(y).attr('alt') !== '') {
        return '<figcaption>' + $(y).attr('alt') + '</figcaption>';
      } else {
        return '';
      } 
    }

    //Called in the setImage function for later use in the next/previous buttons
    function setIndex(y) {
      return $('.gallery-thumbnails img').index(y);
    }

    //Hide/show controls depending on the index of the current image
    function indexCheck() {
      if(selectedIndex === 0) {
        $('.previous').addClass('inactive');
      } else {
        $('.previous').removeClass('inactive');
      }

      if((selectedIndex + 1) === $('.gallery-thumbnails img').length) {
        $('.next').addClass('inactive');
      } else {
        $('.next').removeClass('inactive');
      }
    }

    //Closes the lightbox when a targeted area is clicked
    function closeLightbox() {
      $('.overlay, .lightbox-content').animate({"opacity": "0.0"}, fadeTimerMedium, function() {
        $('.lightbox').css("display", "none");
        $('.overlay').remove();
      });
      lightboxOpen = false;
    }

    //Set the selected image when a thumbnail is clicked
    function setImage(x) {
      selectedIndex = setIndex(x);
      indexCheck();
      caption = getCaption(x);
      selectedThumb = $(x).attr('src');
      selectedFull = selectedThumb.replace('-thumb', '-full');
      selectedPre = selectedThumb.replace('-thumb', '-pre');
    }

    //Place selected image preview and full versions in their respective containers  
    function placeImage() {
      $('.preview-image').html('<figure><img alt ="Image preview" src="' + selectedPre + '">' + caption + '</figure><span class="view-full-image"><img alt="Magnifying glass icon" src="/SiteCollectionImages/magnify-glass-icon.png"></span>');    
      $('.lightbox-content').html('<figure><img alt ="" src="' + selectedFull + '">' + caption + '</figure>' + lightboxClose);

      //Add click event to the lightbox-close button whenever the image changes
      $('.lightbox-close').click(function() {
        closeLightbox();
      });

    }

    function swapImage() {
      $('.preview-image').fadeOut(fadeTimerShort, function() {
        placeImage();
        $('.preview-image').fadeIn(fadeTimerShort);
      });

      $('.gallery-thumbnails img').removeClass('selected');
      currentThumb = $('.gallery-thumbnails img')[selectedIndex];
      $(currentThumb).addClass('selected');

    }

    //Click event that selects image when clicked on
    $('.gallery-thumbnails img').click(function () { 
      if(currentThumb !== this) {
        setImage(this);
        swapImage();
      }
    });

    //Set Default Image on Page Load
    function setDefaultImage() {
      setImage(firstImage);
      placeImage(firstImage);
      $(firstImage).addClass('selected');
      currentThumb = firstImage;
    }

    setDefaultImage();

    //Display full image in lightbox
    $('.preview-image').click(function() {
      $('body').append(overlay);
      $('.lightbox').css('display', 'block');
      $('.overlay').animate({"opacity": "0.9"}, fadeTimerMedium);
      $('.lightbox-content').animate({"opacity": "1.0"}, fadeTimerMedium);
      $('.overlay').click(function() {
        closeLightbox();
      });
      lightboxOpen = true;
    });

    //Gallery controls
    $('.gallery-scroll').click(function() {

      if($(this).hasClass('inactive')) return;

      if($(this).hasClass('previous')) {
        setImage($('.gallery-thumbnails img')[selectedIndex - 1]);
      }
      if($(this).hasClass('next')) {
        setImage($('.gallery-thumbnails img')[selectedIndex + 1]);
      }
      swapImage();
    });

    //Keypress event binder that closes lightbox if esc is pressed and lightbox is open
    $(document).bind('keydown', function(e) {
      if(e.which == 27 && lightboxOpen == true) {
        closeLightbox();
      }
    });

  }
  
});