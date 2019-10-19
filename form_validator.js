/**
 * scripts
 */

/** store form field values */

var fields = ['name', 'email', 'user_email', 'first_name', 'last_name', 'country_prefix', 'phone_num', 'country', 'uid', 'uaction'];
var ActiveLang = "AR";
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzNDZjNDZhYzk1ZjAyZjNiOGIwNS1iNGExZDhhNjhhNzJlYTM0ZDlkMjVkMTQ3YzZjNDhmMDQ4NWE2NjhmMjQzYTA4MjEtNjA5ODgzMjY2YSIsImlhdCI6MTU3MDI1NjE4NCwiZXhwIjoxNTcwMjU5Nzg0LCJuYW1lIjoiSU1BRCJ9.LPsYNkFOL0aawobDFYL01mJGOBdzPK31bafLbHofNek";
function saveField(entry, fieldVal) {
    if (fieldVal != undefined && fieldVal.length > 0) {
        console.log(entry + ' =>> ' + fieldVal);
        localStorage.setItem(entry, fieldVal);
    }
}

function loadField(entry, fieldNewVal, $field) {
    if (fieldNewVal != null && fieldNewVal.length > 0) {
        console.log(entry + ' =>> ' + fieldNewVal);
        //$field.val(fieldNewVal);
        if (entry == "country") {
           // $('.country_prefix').parent('.fieldset').attr('data-countrycode',getCountriesInfo(fieldNewVal, 'iso').toLowerCase());
        }
    }
}

function setCookie(cname, cvalue, exdays) {
    domain = document.domain;
    domain = domain.replace(/^[^.]+\./g, "");
    domain = '.' + domain;
    //console.log(domain);
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + ';domain=' + domain + ';path=/';
}

function isUserID(userID) {
    if (!isNaN(userID) && userID > 0) {
        return true;
    }
    return false;
}

function doWithFields(fields, action) {
    if (fields.length) {

        fields.forEach(function (entry) {
            var $field = jQuery('[name=' + entry + ']');
            if ($field.length) {
                // save field value in localStorage
                if (entry == 'user_name' || entry == 'user_email') {
                    entry = 'email';
                }
                if (entry == 'pw') {
                    entry = 'password';
                }

                // save field value in localStorage
                if (action == 'save') {
                    var fieldVal = $field.val();
                    var nameComplexLength = fieldVal.indexOf(' ');
                    // split name as first_name and last_name
                    if (entry == 'name' && nameComplexLength >= 0) {
                        // save first_name
                        saveField('first_name', fieldVal.substr(0, nameComplexLength));
                        // save last_name
                        saveField('last_name', fieldVal.substr(nameComplexLength + 1));
                    }
                    // save name as first_name
                    if (entry == 'name' && fieldVal.indexOf(' ') == -1) {
                        saveField('first_name', fieldVal);
                    }
                    // save name as name, common case
                    saveField(entry, fieldVal);
                }
                // load field value from localStorage
                if (action == 'load') {

                    if (entry == 'uid') {
                        var existingUser = true;
                        userID = localStorage.getItem(entry);
                        if (!isNaN(userID) && userID > 0) {
                            //console.log('Existing User: '+userID);
                        } else {
                            //Break current form.
                            existingUser = false;
                            return;
                        }
                    } else if (entry == 'uaction') {
                        if (!existingUser) {
                            //break
                            return;
                        }
                    }
                    loadField(entry, localStorage.getItem(entry), $field);
                }
            }
        });
    }
}


function doWithFieldsperID(formid, fields, action) {
    ID = '#' + formid;
    if (fields.length) {
        fields.forEach(function (entry) {
            var $field = jQuery(ID + ' [name=' + entry + ']');
            if ($field.length) {
                if (entry == 'user_name' || entry == 'user_email') {
                    entry = 'email';
                }
                if (entry == 'pw') {
                    entry = 'password';
                }

                if (action == 'save') {
                    var fieldVal = $field.val();
                    if(entry == 'country_prefix' && $($field).parents('.formWrapper').hasClass('native_select')) {
                        fieldVal = $('#country_prefix option:selected').val() || $('#country option:selected').attr('id');
                    }
                    var nameComplexLength = fieldVal.indexOf(' ');
                    if (entry == 'name' && nameComplexLength >= 0) {
                        saveField('first_name', fieldVal.substr(0, nameComplexLength));
                        saveField('last_name', fieldVal.substr(nameComplexLength + 1));
                    }
                    if (entry == 'name' && fieldVal.indexOf(' ') == -1) {
                        saveField('first_name', fieldVal);
                    }
                    saveField(entry, fieldVal);
                }
                if (action == 'load') {
                    if (entry == 'uid') {
                        var existingUser = true;
                        userID = localStorage.getItem(entry);
                        if (!isNaN(userID) && userID > 0) {
                            //console.log('Existing User: '+userID);
                        } else {
                            //Break current form.
                            existingUser = false;
                            return;
                        }
                    } else if (entry == 'uaction') {
                        if (!existingUser) {
                            //break
                            return;
                        }
                    }
                    loadField(entry, localStorage.getItem(entry), $field);
                }
            }
        });
    }
}



jQuery(function () {
    var formSaved = false;
    doWithFields(fields, 'load');
    jQuery('.submit, .lead-form-submit, .signup-form-submit, [type=submit]').bind('click', function () {
        //doWithFields(fields, 'save');
        var formParentID = jQuery(this).parents('.formWrapper').attr('id');
        formSaved = true;
        doWithFieldsperID(formParentID, fields, 'save');
    });

    jQuery(window).unload(function () {
        if (!formSaved) {
            doWithFields(fields, 'save');
            //console.log('Unload Save');
        }
    });
    //enforce cookie update
    addEventListener('DOMContentLoaded', function () {
        if ($('[name="lead_form"]') && $('[name="lead_form"]').length) {
            var cookieNewVal = $('[name="lead_form"]').val().split(' ').join('');
            if (cookieNewVal && cookieNewVal.length > 0) {
                document.cookie = document.cookie = 'lpslug=' + cookieNewVal + '; path=/; expires=3600';
            }
        }
    });
});

jQuery(document).ready(function () {
    jQuery('.get_responder_integrated_form').submit(function (e) {
        var form_id = jQuery(this).attr('id');
        jQuery('#' + form_id).find('input[type="submit"]').attr('disabled', true);
        e.preventDefault();
        $.ajax({
            type: 'POST',
            data: jQuery(this).serialize(),
            url: '/wp-content/themes/1800option/includes/ajax-handler.php',
            success: function (data, textStatus, request) {
                jQuery('#' + form_id).find('input[type="submit"]').removeAttr('disabled');
                //window.location.href = request.responseText;
                if (request.responseText.indexOf('get_response_integrated_form') == -1) {
                    window.location.href = request.responseText;
                } else {
                    console.log(request.responseText);
                    jQuery('#' + request.responseText + ' .error_get_response').append('<div class="get_resp_error"  style=" color:#dd1c1c; display: block;">' + response_message + '</div>');
                    jQuery('#' + request.responseText + ' .get_resp_error').show();
                    jQuery(document).click(function () {
                        jQuery('#' + request.responseText + ' .get_resp_error').remove();
                    })
                }
            }
        });
    });

    var showingSRError = false;

    jQuery('.smar_resp_integrated_form').submit(function (e) {
        srForm = $(this);
        e.preventDefault();
        jQuery.ajax({
            type: 'POST',
            data: jQuery(this).serialize(),
            url: '/wp-content/themes/1800option/lps/smart_class/ajax_hendler.php',
            success: function (data, textStatus, request) {
                //window.location.href = request.responseText;
                if (request.responseText.indexOf('smar_resp_integrated') == -1) {
                    window.location.href = request.responseText;
                } else {
                    jQuery('#tooltip_response').remove();
                    if (srForm.hasClass('sv-gen-2') && !showingSRError) {
                        jQuery('#' + request.responseText + ' .response_fieldset2').append('<div class="tooltip' +
                            ' tooltip_response tooltip_response2" id="tooltip_response2" style="display: block;">' + response_message + '</div>');
                        jQuery('#' + request.responseText + ' .response_fieldset2').show();
                        showingSRError = true;
                    } else if (!showingSRError) {
                        jQuery('#' + request.responseText + ' .response_fieldset').append('<div class="tooltip tooltip_response " id="tooltip_response" style="display: block;">' + response_message + '</div>');
                        jQuery('#' + request.responseText + ' .response_fieldset').show();
                        showingSRError = true;
                    }
                    jQuery(document).click(function () {
                        jQuery('#' + request.responseText + ' .response_fieldset').hide();
                        jQuery('#' + request.responseText + ' .response_fieldset2 .tooltip_response2').remove();
                        jQuery('#' + request.responseText + ' .response_fieldset2').hide();
                        showingSRError = false;
                    });
                }
            }
        });
    });

});

window.onload = function () {
    var cookie_expiration_days = 1;
    var cookie_name = 'users_time_zone'; //please do not change it
    var current_date = new Date();
    var cookie_value = current_date.getTimezoneOffset() / 60;
    if (cookie_value != 0) cookie_value = -cookie_value;
    if (cookie_value > 0) cookie_value = "+" + cookie_value;
    setCookie(cookie_name, encodeURIComponent(cookie_value), cookie_expiration_days);
};

(function ($) {
    $.fn.detachTemp = function () {
        this.data('dt_placeholder', $('<span style="display: none;" />').insertAfter(this));
        return this.detach();
    }

    $.fn.detachTo = function (el) {
        if ($(el).length) {
            this.data('dt_placeholder', $('<span style="display: none;" />').insertAfter(el));
        } else {
            //detachTemp
            this.data('dt_placeholder', $('<span style="display: none;" />').insertAfter(this));
        }
        return this.detach();
    }

    $.fn.reattach = function () {
        console.log('Reattaching');
        if (this.data('dt_placeholder')) {
            //console.log(this.first());
            //console.log(this);
            this.first().insertBefore(this.data('dt_placeholder'));
            this.data('dt_placeholder').remove();
            this.removeData('dt_placeholder');
        } else if (window.console && console.error)
            console.error("Unable to reattach this element " +
                "because its placeholder is not available.");
        return this;
    }
    $.fn.showTooltip = function () {
        console.log('showTooltip');
        $(this).addClass('sv-hover');
        tooltipPopup = $(this).find('.tooltip-popup');
        ttipH = tooltipPopup.outerHeight();
        inputH = $(this).parent('.fieldset').find('input').outerHeight();
        ttipOffset = (ttipH / 2) - (inputH / 2);
        tooltipPopup.css('top', '-' + ttipOffset + 'px');
    }
    $.fn.hideTooltip = function () {
        console.log('hideTooltip');
        $(this).removeClass('sv-hover');
    }
    $.fn.toggleTooltip = function () {
        console.log('toggleTooltip');
        if ($(this).hasClass('sv-hover')) {
            $(this).hideTooltip();
        } else {
            $(this).showTooltip();
        }
    }
})(jQuery);



$(document).ready(function () {
    /* Hide Username (antibot) */
    if ($('.formWrapper .sv-skin').length) {
        $('.sv-skin [id="username"]').parent().hide();

        EmailField = $('#formfull.sv-skin [id="user_email"]');
        if (EmailField.length && EmailField.parents('form').hasClass('native_select')) {
            EmailFieldset = EmailField.parent();
            EmailFieldsetHTML = EmailFieldset.html();
            var $emailMove = $(EmailFieldset).detachTo($("#formfull.sv-skin .clear"));
            $emailMove.reattach();
        }

        /* Remove pw class from pw2 field */
        $('.sv-skin input#pw2').removeClass('pw');
        $('form.sv-skin').addClass('form-' + ActiveLang);

        /* Add Tooltip Popups */
        $('.sv-skin input#user_email,input#awf_field_email').after('<div class="tooltip-popup-wrap"><div class="tooltip-popup-icon"></div><div class="tooltip-popup">' + email_tooltip_popup_helper + '</div></div>')
        // $('.sv-skin input#pw').after('<div class="tooltip-popup-wrap"><div class="tooltip-popup-icon"></div><div class="tooltip-popup">' + pw_tooltip_popup_helper + '</div></div>')
        if (!$('.password_eye-icon').length){
            $('.sv-skin input#pw').after('<div class="tooltip-popup-wrap"><div class="tooltip-popup-icon"></div><div class="tooltip-popup">'+pw_tooltip_popup_helper+'</div></div>');
        } else {
            $('.password_eye-icon').on("click", function () {
                var typeInput = $(this).parent().find('input');


                if(typeInput.attr("type") == "password") {
                    typeInput.attr("type", "text");
                    $(this).addClass("password_eye-icon--block");
                } else {
                    typeInput.attr("type", "password");
                    $(this).removeClass("password_eye-icon--block");
                }
            });

            $('.formWrapper').find('input:not([type="submit"])').each(function(){
                $(this).focus(function(){
                    $targetWrapper = $(this).parents('.formWrapper');
                    $targetField = $(this).parent('.fieldset');
                    if ($targetField.hasClass('fr')) {
                        $targetField = $targetField.add($targetField.siblings('.fl'));
                    }
                    $targetWrapper.find('.fieldset.input_focused').removeClass('input_focused');
                    $targetField.addClass('input_focused');
                });
                $(this).blur(function(){
                    $targetField = $(this).parent('.fieldset');
                    if ($targetField.hasClass('fr')) {
                        $targetField = $targetField.add($targetField.siblings('.fl'));
                    }
                    $targetField.removeClass('input_focused');
                });
            });
        }
        /* Begin Show drop-list, four fields form*/
        if ($('.drop-c-list-trigger').length){
            $('.drop-c-list-trigger').click(function () {
                var parent = $(this).parents('.c-flag-parent');
                parent.find('.drop-c-list').toggleClass('drop-c-list--show');
            });

            $(document).on('click', function(e) {
                if (!$(e.target).closest('.flag-wrapper').length) {
                    $('.drop-c-list').removeClass('drop-c-list--show');
                }
                e.stopPropagation();
            });

            $('.drop-c-list__item').on('click', function (evt) {
                var $this = $(this),
                    $countryId = $this.data('id'),
                    $countryName = getCountriesInfo($countryId, 'name'),
                    $phonePrefix = getCountriesInfo($countryId, 'countryCode'),
                    $countryIso = getCountriesInfo($countryId, 'iso').toLowerCase(),
                    $parentForm = $this.closest('form');
                $parentForm.find('#tooltip_country, #tooltip_phone_num_digits, #tooltip_phone_num').hide();
                $parentForm.find('[name="country_prefix"]').val($phonePrefix).parent().attr('data-countrycode', $countryIso);
                $parentForm.find('[name="country"]').val($countryId).trigger('change');
                //updateCurrencyToUSD($countryName);
                evt.preventDefault();

                $('.drop-c-list').removeClass('drop-c-list--show');
            })
        }
        /* End Show drop-list, four fields form*/
        /* Wrap Submit button with Fieldset */
        $('.sv-skin .lead-form-submit').wrap('<div class="fieldset" id="submit-fieldset"></div>');
        /* Wrap Terms with Fieldset */
        $('.sv-skin #terms').wrap('<div class="fieldset" id="terms-fieldset"></div>');

        $('.sv-skin .custom-checkbox').click(function () {
            $(this).toggleClass('checked');
            $('.sv-skin #tooltip_terms').hide('slow');
        });

        /* Tooltip Popup (Helper) positioning */
        var touchDev = false;
        $('.tooltip-popup-icon').on('touchstart', function () {
            //alert('touchstart');
            //console.log('touchstart');
            touchDev = true;
            $('.tooltip-popup-icon').not(this).parent().hideTooltip(); //remove all tooltips first except this (reset)
            $(this).parent().toggleTooltip();
        });

        $('.tooltip-popup-wrap').mouseover(function () {
            if (!touchDev) {
                //alert('mouseover');
                //console.log('mouseover');
                $(this).showTooltip();
                var unixTime = Date.now();
                $(this).attr('id', 'tooltip-popup-wrap-' + unixTime);
            }
        });

        $('.tooltip-popup-wrap').mouseout(function () {
            //alert('mouseout');
            //console.log('mouseout');
            $(this).hideTooltip();
        });

        //Open Account Terms URL
        if (typeof termsURL !== 'undefined') {
            $('.sv-skin #terms a').attr('href', termsURL);
            $('.sv-skin #terms a').attr('target', "_blank");
        }

        //Login URL
        // if (typeof loginURL !== 'undefined') {
        //     $('.sv-skin a#login-link').attr('href',loginURL);
        // }

        /* update/create user */
        if ($('input#uid').length && $('input#uaction').length) {
            userID = $('input#uid').val();
            if (isUserID(userID)) {
                $('input#uaction').val('apr_update_user');
            }
        }


        /* Floating Form */
        $('body.has-floating-form').on('ffopen', function () {
            //console.log('ffopening');
            ffHeight = $('#formWrapper-ff').height();
            ffHeight = ffHeight + 46;
            $('body.has-floating-form').css('padding-bottom', ffHeight + 'px');
        });

        $('body.has-floating-form').on('ffclosed', function () {
            //console.log('ffclosing');
            $('body.has-floating-form').css('padding-bottom', '0');
        });


    }

    //Add class for fix ltr opera bug with select element
    $('select#country,  select#currency').parent().addClass('select-parent');

    //Add default currency
    var currency = $('select[name="currency"]');
    if ( currency && currency.length > 0) {
        currency.val($('.country :selected').attr('data-currency'));
    }
    /** Default currency USD for selected countries */
    var countrySelector = document.getElementById('country'),
        currencySelector = document.querySelectorAll('[name="currency"]'),
        usdCountries = ['Brazil', 'Mexico', 'Colombia', 'Argentina', 'Peru', 'Venezuela', 'Chile',
            'Ecuador', 'Guatemala', 'Cuba', 'Haiti', 'Bolivia', 'Dominican Republic', 'Honduras',
            'Paraguay', 'Nicaragua', 'El Salvador', 'Costa Rica', 'Panama', 'Puerto Rico', 'Uruguay'
        ];

    function updateDefaultCurrency(event, selector) {
        var target = selector || event.target;
        var curr = getCountriesInfo($(target).val(), 'currency');
        $(currencySelector).val(curr);
    }

    if ((countrySelector && countrySelector !== null) &&
        (currencySelector && currencySelector !== null)) {
        countrySelector.addEventListener('change', updateDefaultCurrency);
        countrySelector.addEventListener('DOMContentLoaded', updateDefaultCurrency);
        // updateDefaultCurrency(null, countrySelector);
    }
});

$(document).ready(function(){
    $('.native_select .country').change(function(){
        newCountry = $(this).val();
        $('.country').each(function(){
            country = $(this).val();
            if (country != newCountry) {
                $(this).val(newCountry).change();
            }
        });


        var countryPrefixInput = $('.country_prefix');
        countryPrefixInput.val($('.country :selected').attr('id'));
        var currentCountryKey = $('.country :selected').attr('value');
        countryPrefixInput.parent('.fieldset').attr('data-countrycode',getCountriesInfo(currentCountryKey, 'iso').toLowerCase());
        //$('#currency').val($('.country :selected').attr('data-currency'));
    });

    var touchDev = false;
    $('.tooltip-popup-icon').on('touchstart', function () {
        //alert('touchstart');
        //console.log('touchstart');
        touchDev = true;
        $('.tooltip-popup-icon').not(this).parent().hideTooltip(); //remove all tooltips first except this (reset)
        $(this).parent().toggleTooltip();
    });

    $('.tooltip-popup-wrap').mouseover(function () {
        if (!touchDev) {
            //alert('mouseover');
            //console.log('mouseover');
            $(this).showTooltip();
            var unixTime = Date.now();
            $(this).attr('id', 'tooltip-popup-wrap-' + unixTime);
        }
    });

    $('.tooltip-popup-wrap').mouseout(function () {
        //alert('mouseout');
        //console.log('mouseout');
        $(this).hideTooltip();
    });


})

function is_restricted_country(formParent){

    if (formParent.hasClass('native_select')) {
        var selCountry = formParent.find('.country :selected').text();
    } else {
        var countryID = formParent.find('.country').val();
        var selCountry = getCountriesInfo(countryID, 'name');
    }
    if (js_restricted_countries.indexOf(selCountry) > 0)
        return true;
    return false;
}

function add_helper(inputbox, parentID) {
    $(parentID + ' .' + inputbox).addClass('error');
    $(parentID + ' .' + inputbox + '-helper').remove();
    $(parentID + ' .' + inputbox + '-approved').remove();
    //$('.tooltip').not('.tooltip_'+inputbox).hide('slow');
    $(parentID + ' .tooltip_' + inputbox).show('slow');
}

function add_approved(inputbox, parentID) {
    $(parentID + ' .' + inputbox).removeClass('error');
    $(parentID + ' .' + inputbox + '-helper').remove();
    $(parentID + ' .' + inputbox + '-approved').remove();
    $(parentID + ' .' + inputbox).after('<div class="approved ' + inputbox + '-approved">✔</div>');
}

function validatemail(email) {
    //var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //var emailReg = /^[a-zA-Z0-9.’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var emailReg = /^(?!.*(?:''|\.\.|\-\-|\_\_))[A-Za-z0-9-.\'-\_]+@([\da-zA-Z-]{1,}\.)+[a-zA-Z-]{2,5}$/;
    return emailReg.test(email) ? email.length <= 48 : false;
}

function validateprefix(number) {
    var numberReg = /^[0-9]{1,4}$/;
    return (numberReg.test(number));
}

function validatephone(number) {
    var numberReg = /^[0-9]{1,16}$/;
    return (numberReg.test(number));
}

function validatename(name) {
    var nameReg = /^([^0-9]*)$/;
    return (nameReg.test(name));
}

function validatepass(name) {
    var nameReg = /^((?=.*\d)(?=.*[a-zA-Z]).{8,25})$/g;
    return (nameReg.test(name));
}

function svalidatePass(pw) {
    if (validatepass(pw) && pw.length >= 6)
        return true;
    return false;
}

function is_key_digit(key) {
    var isDigit = false;
    //console.log(key);
    //digits consists of letters because of the numpad. The numbpad's keycode is actually letters.
    digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', '`'];
    $(digits).each(function () {
        if (this == key) {
            //console.log(this);
            isDigit = true;
        }
    });
    return isDigit;
}

// function is_key_nondigit(key) {
//     if (!is_key_digit(key)) {
//         console.log(key);
//         return true;
//     }
//     return false;
// }

function not_bot() {
    $('.ubot').each(function () {
        $(this).val(0);
    });
}
setTimeout(function () {
    not_bot()
}, 2000);

function validateFields(clicked, fieldid) {
    ID = '#' + fieldid;
    $(ID + ' .helper').remove();
    $(ID + ' .required').removeClass('error');
    var error = false;
    var shortForm = false;
    var ajaxURL = "ajax-handler.php";

    if ($(ID + ' .af-form-wrapper').length) {
        shortForm = true;
        // Short Form Validations only.
        if ($(ID + ' .user_name').length) {
            if ($(ID + ' .user_name').val() == '') {
                if (clicked) {
                    error = true;
                    $(ID + ' .user_name').val('');
                    $(ID + ' .user_name').attr('placeholder', enter_name_txt);
                    //$('.user_name').focus();
                    $(ID + ' .user_name').addClass('error empty-inp');
                }
            } else {
                $(ID + ' .user_name').removeClass('empty-inp');
                if ($(ID + ' .user_name').val().length < 2 || !validatename($(ID + ' .user_name').val())) {
                    error = true;
                    add_helper('user_name', ID);
                    console.log(4);
                } else {
                    add_approved('user_name', ID);
                }
            }
        }

        if ($(ID + ' input#firstnameHidden').length && $(ID + ' input#lastnameHidden').length) {
            //split name to firstname and lastname
            var userFullName = $(ID + ' input.user_name').val().split(' ');
            $(ID + ' input#firstnameHidden').val(userFullName[0]); //userFullName[0] Holds First Name
            $(ID + ' input#lastnameHidden').val(userFullName[userFullName.length - 1]); //userFullName.length - 1 Holds Last name
        }

    } else {

        //Long Form Validations

        if ($(ID + ' .first_name').val() == '') {
            if (clicked) {
                error = true;
                $(ID + ' .first_name').attr('placeholder', enter_fname_txt);
                $(ID + ' .first_name').addClass('error empty-inp');
            }
        } else {
            $(ID + ' .first_name').removeClass('empty-inp');
            if ($(ID + ' .first_name').val().length < 2 || !validatename($(ID + ' .first_name').val())) {
                error = true;
                add_helper('first_name', ID);
                console.log(4);
            } else {
                add_approved('first_name', ID);
            }
        }

        if ($(ID + ' .last_name').val() == '') {
            if (clicked) {
                error = true;
                $(ID + ' .last_name').attr('placeholder', enter_lname_txt);
                $(ID + ' .last_name').addClass('error empty-inp');
            }
        } else {
            $(ID + ' .last_name').removeClass('empty-inp');
            if ($(ID + ' .last_name').val().length < 2 || !validatename($(ID + ' .last_name').val())) {
                error = true;
                add_helper('last_name', ID);
            } else {
                add_approved('last_name', ID);
            }
        }

        if ($(ID + ' .pw').length) {
            //only if PW field exists.
            if ($(ID + ' .pw').val() == '') {
                if (clicked) {
                    error = true;
                    $(ID + ' .pw').attr('placeholder', enter_pw_txt);
                    $(ID + ' .pw').addClass('error empty-inp');
                }
            } else {
                $(ID + ' .pw').removeClass('empty-inp');
                if (!svalidatePass($(ID + ' .pw').val())) {
                    error = true;
                    add_helper('pw', ID);
                    //disable pw2 field
                    console.log('pw not validated');
                    $(ID + ' .pw2').attr('disabled', 'disabled');
                    $(ID + ' .pw2').attr('readonly', 'readonly');
                } else {
                    add_approved('pw', ID);
                }
            }
        }

        if ($(ID + ' .pw2').length && $(ID + ' .pw').length) {
            if ($(ID + ' .pw2').val() == '') {
                if (clicked) {
                    error = true;
                    $(ID + ' .pw2').attr('placeholder', enter_pw2_txt);
                    $(ID + ' .pw2').addClass('error empty-inp');
                }
            } else {
                $(ID + ' .pw2').removeClass('empty-inp');
                if ($(ID + ' .pw').val() != $(ID + ' .pw2').val()) {
                    error = true;
                    add_helper('pw2', ID);
                } else {
                    add_approved('pw2', ID);
                }
            }
        }

        //Country dropdown
        if ($(ID + ' #country').length) {
            if (clicked) {
                if ($(ID + ' #country').val() == '') {
                    error = true;
                    $(ID + ' #country').addClass('error empty-inp');
                }
            }
        }

        //Currency
        if ($(ID + ' #currency').length) {
            if (clicked) {
                if ($(ID + ' #currency').val() == '') {
                    error = true;
                    $(ID + ' #currency').addClass('error empty-inp');
                }
            }
        }

        //Terms
        if ($(ID + ' #terms-checkbox').length) {
            if (clicked) {
                if (!$(ID + ' #terms-checkbox').hasClass('checked')) {
                    $(ID + ' #terms-checkbox').addClass('error');
                    //alert('Please accept Terms and Conditions');
                    add_helper('terms', ID);
                    error = true;
                }
            }
        }


        if ($(ID + ' .country_prefix').val() == '') {
            if (clicked) {
                error = true;
                $(ID + ' .country_prefix').attr('placeholder', required_txt);
                $(ID + ' .country_prefix').addClass('error empty-inp');
            }
        } else {
            $(ID + ' .country_prefix').removeClass('empty-inp');
            if (!validateprefix($(ID + ' .country_prefix').val())) {
                error = true;
                add_helper('country_prefix', ID);
            } else {
                add_approved('country_prefix', ID);
            }
        }

        if ($(ID + ' .phone_num').val() == '') {
            if (clicked) {
                error = true;
                $(ID + ' .phone_num').attr('placeholder', enter_phone_txt);
                $(ID + ' .phone_num').addClass('error empty-inp');
            }
        } else {
            $(ID + ' .phone_num').removeClass('empty-inp');
            if (!validatephone($(ID + ' .phone_num').val()) && $(ID + ' .phone_num').val().length >= 7) {
                error = true;
                add_helper('phone_num_digits', ID);
            } else if (!validatephone($(ID + ' .phone_num').val()) || $(ID + ' .phone_num').val().length < 7) {
                error = true;
                add_helper('phone_num', ID);
            } else {
                add_approved('phone_num', ID);
            }
        }

    } //End Long Form Validations condition


    if ($(ID + ' .user_email').val() == '') {
        if (clicked) {
            error = true;
            $(ID + ' .user_email').attr('placeholder', enter_email_txt);
            $(ID + ' .user_email').addClass('error empty-inp');
        }
    } else {
        $(ID + ' .user_email').removeClass('empty-inp');
        if (!validatemail($(ID + ' .user_email').val())) {
            error = true;
            add_helper('user_email', ID);
            /*} else if (clicked && !error && $(ID+' .ubot').val() == '1') {
             //User submitted the form correctly but way too fast. Goodbye.
             error = true;
             window.location.href = "http://www.forbes.com/";*/
        } else {
            if (clicked && !error && !shortForm) {
                $("#loader").show();

                /* R.L - new additions form with p/w */
                userFname = $(ID + ' #first_name').val(); 
                userLname = $(ID + ' #last_name').val();
                userEmail = $(ID + ' #user_email').val();
                userPhone = $(ID + ' #phone_num').val();
                userCPrefix = $(ID + ' #country_prefix').val();
                userCountry = $(ID + ' #country').val();
                userPass = $(ID + ' #pw').val();
                userLanguage = $(ID + ' .language').val();
                userSecondaryLanguage = userLanguage ? userLanguage.toUpperCase() : '';

                if ($(ID + ' #currency').length) {
                    userCurrency = $(ID + ' #currency').val();
                } else {
                    userCurrency = 'USD';
                }

                if ($(ID + ' #uaction').length) {
                    error = true; //Disable default action.
                    uAction = $(ID + ' #uaction').val();
                    uID = $(ID + ' #uid').val();
                    $("#lead-form-submit").attr("disabled", true);

                    $.ajax({
                        type: 'POST',
                        url: ajaxURL,
                        async: true,
                        crossDomain: true,
                        dataType: 'json',
                        processData: false,
                        data: {
                            action: uAction,
                            uid: uID,
                            firstName: userFname,
                            lastName: userLname,
                            email: userEmail,
                            phone: userPhone,
                            country_prefix: userCPrefix,
                            country: userCountry,
                            pw: userPass,
                            currency: userCurrency,
                            language: userLanguage,
                            secondaryLanguage: userSecondaryLanguage,
                            csrf: $(ID + ' [name=csrf]').val()
                        },
                        success: function (result) {
                            console.log('Result: ' + result);
                            window.location.replace("https://etijaria.com/lands/thanks.html");
                            // if (result == 'Success') {
                            //     twttr.conversion.trackPid('o29cf', { tw_sale_amount: 0, tw_order_quantity: 0 });
                            //     $('#binarylogin #e').val(userEmail);
                            //     $('#binarylogin #p').val(userPass);
                            //     $('#binarylogin').trigger('submit');
                            // } else {
                            //     // alert('There is a problem with your registration.');
                            //     //$('#processing').hide();
                            //     error = true;
                            //     $(ID + ' .tooltip_existing').show('slow');
                            //     $('#loader').hide();
                            //     $("#lead-form-submit").attr("disabled", false);
                            //     return false;
                            // }
                        },
                        async: true
                    });
                } else if ($(ID + ' #apr_create_lead_royal').length){
                    $('#loader').show();
                    userFname = $(ID + ' #first_name').val();
                    userLname = $(ID + ' #last_name').val();
                    userEmail = $(ID + ' #user_email').val().toLowerCase();
                    userPhone = $(ID + ' #phone_num').val();
                    userCPrefix = $(ID + ' #country_prefix').val();
                    userCountryCode = $(ID + ' #country').val();
                    userCountry = getCountriesInfo(userCountryCode, 'iso');
                    siteLanguage = $(ID + ' #language').val();
                    targetsite = $(ID + ' [name="target_site"]').val();
                    $("#lead-form-submit").attr("disabled", true);
                    $.ajax({
                        async: true,
                        crossDomain: true,
                        type: 'POST',
                        url: ajaxURL,
                        data: {
                            // action: 'apr_create_lead_royal',
                            firstName: userFname,
                            lastName: userLname,
                            email: userEmail,
                            phone: userPhone,
                            country_prefix: userCPrefix,
                            country: userCountry,
                            leadSource : 'AdWords',
                            campaign_id: 1,
                            campaign_name: 'QAR',
                            language: siteLanguage,
                        },
                        success: function (result) {
                            result = JSON.parse(result);
                            console.log(result);
                            if(result.success){
                               window.location.replace("https://etijaria.com/lands/thanks.html"); 
                            }else{
                                alert(result.message);
                            }
                            
                            // if (result.error == false) {
                            //     twttr.conversion.trackPid('o29cf', { tw_sale_amount: 0, tw_order_quantity: 0 });
                            //     window.dataLayer.push({
                            //         'emailValue': $(ID + ' #user_email').val().toLowerCase(),
                            //         'event': 'LeadFormSubmit',
                            //         'eventCallback': function () {
                            //             console.log('Pixel shot done. Form is submitting --- crl');
                            //             window.location.href = result.redirectLink;
                            //         }
                            //     });
                            // } else {
                            //     error = true;
                            //     $(ID + ' .tooltip_existing').show('slow');
                            //     $('#loader').hide();
                            //     $("#lead-form-submit").attr("disabled", false);
                            //     return false;
                            // }
                        },
                        async: true
                    });
                    return false;
                } else {
                    add_approved('user_email', ID);
                    alert("Hello");
                    $(ID + ' form').trigger('submit');

                    return false;
                }
            }
        }
    }
    return false;
}

var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform); // fix for double click issue on iOS
var initialScrollPosition = 0;
    
$(document).ready(function(){
    if (iOS) {
        $('form .lead-form-submit').on('touchstart', function (){
            initialScrollPosition = $(window).scrollTop();
        });
    }

    $('form .lead-form-submit').on((iOS ? 'touchend' : 'click'), function () {
        if (iOS) {
            var scrollPos = $(window).scrollTop();
            // if user just scrolling page, not tap on submit button
            if ((scrollPos > initialScrollPosition && scrollPos - initialScrollPosition >= 30) ||
                (initialScrollPosition > scrollPos && initialScrollPosition - scrollPos >= 30)) {
                return false;
            }
        }
        formParent = $(this).parents('.formWrapper');
        formParentID = formParent.attr('id');
        formParent.find('.tooltip').hide();
        if (is_restricted_country(formParent)) {
            $('#' + formParentID + ' #tooltip_country').show('slow');
            return false;
        } else {
            return (validateFields(true, formParentID));
        }
    });



});

//prevent symbols from mobile keyboard, prevent copy/past
$(document).ready(function () {

    var isMobile = window.matchMedia("only screen and (max-width: 1024px)");
    var phone_inputs = document.querySelectorAll('#country_prefix, #phone_num');
    var name_inputs = document.querySelectorAll('#first_name, #last_name');


    var rege = /[|&;$%#!*?'"~\\\/<>()^№:@._=\[\]{}+,0-9]/;

    if (isMobile.matches) {

        if (name_inputs[0] != null) {
            for (var i = 0; i < name_inputs.length; i++) {
                name_inputs[i].addEventListener('keyup', function (e) {
                    var value = this.value;
                    var space_count = (this.value.match(/\s/g) || []).length;
                    if (rege.test(value.charAt(value.length - 1)) || (space_count >= 2)) {
                        this.value = value.substring(0, value.length - 1);
                    }
                });
            }
        }
        for (var i = 0; i < phone_inputs.length; i++) {
            phone_inputs[i].addEventListener('keyup', function (e) {
                var value = this.value;
                if (e.keyIdentifier == 'U+0008') {
                    return;
                } else {
                    if (!/\d/.test(value.charAt(value.length - 1))) {
                        if (this.value == 0) {
                            this.value = "";
                        } else {
                            this.value = this.value.substring(0, this.value.length - 1);
                        }
                    }
                }
            });
        }
    } else {
        if (name_inputs[0] != null) {
            for (var i = 0; i < phone_inputs.length; i++) {
                name_inputs[i].addEventListener('keydown', function (e) {
                    var space_count = (this.value.match(/\s/g) || []).length;
                    if (rege.test(e.key) || (space_count >= 1 && /\s/g.test(e.key))) {
                        e.preventDefault();
                    }
                });
            }
            /*for (var i = 0; i < phone_inputs.length; i++) {
             phone_inputs[i].addEventListener('keydown', function(e){
             if ((e.key == 'Tab') || (e.key == 'a' && e.ctrlKey) || (e.key == 'v' && e.ctrlKey) || e.key == "Delete" || e.key == "Insert" || e.key == "Shift" || e.key == "Alt" || e.key == "Backspace" || e.key == "Control" || /[0-9]/.test(e.key)) {
             return true;
             }
             else {
             e.preventDefault();
             }
             });
             }*/
        }
    }
    // autocomplete for android
    var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
    if(isAndroid && $('.formWrapper').length) {
        $('[name="first_name"]').attr('autocomplete','fname');
        $('[name="last_name"]').attr('autocomplete','lname');
        $('[name="phone_num"]').attr('autocomplete','tel');
        $('[name="user_email"]').attr('autocomplete','email');
    }

    $('.required').blur(function () {
        formParent = $(this).parents('.formWrapper');
        formParentID = formParent.attr('id');
        EleID = formParentID;
        return (validateFields(false, EleID));
    });

    $('.required').change(function () {
        formParent = $(this).parents('.formWrapper');
        $(this).removeClass('empty-inp');
        formParentID = formParent.attr('id');
        EleID = formParentID;
        return (validateFields(false, EleID));
    });

    $('.required').keydown(function (e) {
        formParent = $(this).parents('.formWrapper');
        formParentID = formParent.attr('id');

        var neutralKey = false;
        var keyRaw = e.which || e.keyCode;
        var keyPressed = String.fromCharCode(e.keyCode);
        var keyTarget = e.target;
        var keyTargetID = $(keyTarget).attr('id');
        var isShiftKey = false;
        isShiftKey = e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;
        //console.log(isShiftKey);
        //console.log(keyTargetID);
        var neutralKeyCodes = ['8', '9', '46', '37', '39', '35', '36'];
        $(neutralKeyCodes).each(function () {
            if (keyRaw == this) {
                neutralKey = true;
            }
        });

        /*var digitOnlyInputs = ['country_prefix','phone_num'];
         $(digitOnlyInputs).each(function(){
         if (keyTargetID == this) {
         if ((!is_key_digit(keyPressed) && !neutralKey) || isShiftKey) {
         e.preventDefault();
         return false;
         }
         }
         });*/

        var noDigitInputs = ['first_name', 'last_name', 'user_name', 'awf_field_name'];
        $(noDigitInputs).each(function () {
            if (keyTargetID == this) {
                if (is_key_digit(keyPressed) && !neutralKey) {
                    e.preventDefault();
                    return false;
                }
            }
        });


        //special case for PW2 field
        if ($('#' + formParentID + ' input#pw').length && $('#' + formParentID + ' input#pw2').length) {
            userPW = $('#' + formParentID + ' input#pw').val();
            if (svalidatePass(userPW)) {
                //console.log('Validated Password: '+userPW);
                $('#' + formParentID + ' .pw2').removeAttr('disabled', 'disabled');
                $('#' + formParentID + ' .pw2').removeAttr('readonly', 'readonly');
            }
        }

        flag = false;
        if ($(this).hasClass('pw2')) {
            //this is pw2 field.
            if (userPW == "") {
                $('#' + formParentID + ' .pw').attr('placeholder', enter_pw_txt);
                $('#' + formParentID + ' .pw').addClass('error');
                add_helper('pw2', '#' + formParentID);
                flag = true;
            }
        }

        if (!flag) {
            $('#' + formParentID + ' .tooltip_' + $(this).attr('id')).hide('slow');
            $('#' + formParentID + ' .tooltip_existing').hide('slow');
        }
    });

    $('.required').keyup(function (e) {
        formParent = $(this).parents('.formWrapper');
        formParentID = formParent.attr('id');
        $(this).removeClass('empty-inp');

        if ($('#' + formParentID + ' input#pw').length && $('#' + formParentID + ' input#pw2').length) {
            //special case for PW2 field
            userPW = $('#' + formParentID + ' input#pw').val();
            userPW2 = $('#' + formParentID + ' input#pw2').val();
            if (svalidatePass(userPW)) {
                //console.log('Validated Password: '+userPW);
                $('#' + formParentID + ' .pw2').removeAttr('disabled', 'disabled');
                $('#' + formParentID + ' .pw2').removeAttr('readonly', 'readonly');
            }

            if (userPW2 == "") {
                $('#' + formParentID + ' .tooltip_pw2').hide('slow');
            }
        }
    });

    $('.required').click(function () {
        formParent = $(this).parents('.formWrapper');
        formParentID = formParent.attr('id');
        $('#' + formParentID + ' .tooltip_' + $(this).attr('id')).hide('slow');
        $('#' + formParentID + ' .tooltip_phone_num_digits').hide('slow');
        $('#' + formParentID + ' .tooltip_existing').hide('slow');
    });

    $('.required').focus(function () {
        console.log('focus');
        formParent = $(this).parents('.formWrapper');
        formParentID = formParent.attr('id');
        console.log('#' + formParentID + ' .tooltip_' + $(this).attr('id'));
        $('#' + formParentID + ' .tooltip_' + $(this).attr('id')).hide('slow');
        $('#' + formParentID + ' .tooltip_phone_num_digits').hide('slow');
        $('#' + formParentID + ' .tooltip_existing').hide('slow');
    });

});