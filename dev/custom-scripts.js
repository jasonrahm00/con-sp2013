$(document).ready(function() {
  
  //If there are custom content zones with empty containers, the zone is hidden from the page 
  $.each($('.content-zone .ms-rtestate-field'), function(index, value) {
    $(value).html() === ''  ? $(value).parent().css('display', 'none') : '';
  });
    
  //Disable table sorting in table header row
  $('.disable-table-sort th').css('pointer-events', 'none')
  $('.disable-table-sort th').each(function(index, value) {
    $(value).html($(value)[0].textContent);
  });
  
  
  
  /**************************************************************************
                        Breadcrumb Overrides
  **************************************************************************/
  
  (function() {
    
    if($('#breadcrumbContainer a:not(:link)')) {
      $('#breadcrumbContainer a:not(:link)').hide().parent().next().hide();
      //$('#breadcrumbContainer>span span').last().prev().hide();
    }
    
    
    if(_spPageContextInfo.siteServerRelativeUrl == _spPageContextInfo.webServerRelativeUrl) {
      if(!(window.location.href.indexOf('Pages') > -1) || window.location.href.indexOf('Pages/home') > -1) {
        return;
      } else {
        $('#breadcrumbContainer').show();
      }
    } else {
      $('#breadcrumbContainer').show();
    }
    
  })();
  
  
  
  /**************************************************************************
                      Custom Side Nav Functionality
  **************************************************************************/
    
  (function() {
    
    //Remove Recent from Side Nav
    $(".ms-core-listMenu-item:contains('Recent')").parent().remove();
    
    //Place 'selected' class on sub-site home link when on the subsite home page
      //SharePoint should do this automatically, but it is inconsistent, for some reason
    if(window.location.href.indexOf('/Pages/default.aspx') > -1) {
      $('#sideNavBox ul.ms-core-listMenu-root>li:first-child>a').addClass('ms-core-listMenu-selected');
    }    
    
    //Determine if submenus are present and open them if the containing link is selected
    if('#sideNavBox .ms-core-listMenu-root li.static ul.static li.selected') {
      var activeSideNavLink = $('#sideNavBox .ms-core-listMenu-root li.static ul.static li.static.selected');
      $(activeSideNavLink).parent().css('display', 'block');
      $(activeSideNavLink).parent().prev().addClass('active-menu');
    }

    //Add click event to side nav items to trigger accordion where sub-menus are available
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
    
    //Side Nav revealed only after manipulates are completed
    $('#sideNavBox').removeClass('hidden');
    
  })();


  
  /**************************************************************************
                      Custom List Filter Functionality
  **************************************************************************/
  
  (function() {
    if($('.list-filter').length > 0){
    
      var currentUrl = window.location.href,
          cleanUrl = currentUrl.split('?')[0] ? currentUrl.split('?')[0] : currentUrl,
          filterValue;

      if(currentUrl.indexOf('?') > -1) {
        $('.list-filter input').each(function(index, value) {
          if(currentUrl.indexOf($(value).val()) > -1) {
            $(value).parent().addClass('active');
          }
        });
      } else {
        $('.list-filter label').first().addClass('active');
      }
      
      filterValue = $('.list-filter label.active input').val();
      
      $('.list-filter input').click(function() {
        if(filterValue === $(this).val()) {
          return
        } else {

          filterValue = $(this).val();

          if(filterValue === 'all') {
            window.location.replace(cleanUrl);

          } else {
            window.location.replace(cleanUrl + '?' + filterValue);
          }
        }
      });   
      
    }    
  })();  
  
  
  
  /**************************************************************************
                      Custom Accordion Functionality
  **************************************************************************/

  (function() {
    if($('.accordion-header').length > 0) {
      
      $('.accordion-header').click(function() {
        if($(this).hasClass('active')) {
          $(this).next().slideUp();
          $(this).removeClass('active');
        } else {
          $('.accordion-header').next().slideUp();
          $('.accordion-header').removeClass('active');
          $(this).next().slideDown();
          $(this).addClass('active');
        }
      });
      
      //Print button can be added to the page if users want to open all accordions then print the page
        //@print media query won't open all accordions, for some reason
      $('.print-accordion').click(function() {
        $('.accordion-content').css('display', 'block');
        window.print();
      })
    }    
  })();
  
   
      
  /**************************************************************************
                      Custom Quick Link Functionality
  **************************************************************************/
  //Used on pages where Promoted Links are hard-coded instead of used for app (IT Homepage)
  $('.quick-link-container').hover(
    function() {
      $(this).find('.quick-link-content').animate({top: '0px'},250);
    }, function() {
      $(this).find('.quick-link-content').animate({top: '100px'},250);
    }
  );
  
  
  
  /**************************************************************************
                        Custom Photo Gallery
  **************************************************************************/
  
  (function() {
    if($('.photo-gallery').length > 0) {
      var caption, currentThumb, selectedIndex, selectedThumb,
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
      }

      //Place selected image preview and full versions in their respective containers  
      function placeImage() {
        $('.preview-image').html('<figure><img alt ="Image preview" src="' + selectedThumb + '">' + caption + '</figure><span class="view-full-image"><img alt="Magnifying glass icon" src="/SiteCollectionImages/magnify-glass-icon.png"></span>');    
        $('.lightbox-content').html('<figure><img alt ="" src="' + selectedThumb + '">' + caption + '</figure>' + lightboxClose);

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
  })();
  
});