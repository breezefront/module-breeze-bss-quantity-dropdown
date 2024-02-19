/**
 * BSS Commerce Co.
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the EULA
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://bsscommerce.com/Bss-Commerce-License.txt
 *
 * @category   BSS
 * @package    Bss_QuantityDropdown
 * @author     Extension Team
 * @copyright  Copyright (c) 2018-2019 BSS Commerce Co. ( http://bsscommerce.com )
 * @license    http://bsscommerce.com/Bss-Commerce-License.txt
 */

define([
    "jquery",
    "jquery/ui",
    "mage/validation"
], function ($) {
    "use strict";

    window.bss_qty_dropdown = "bss-qty-dropdown";
    window.bss_qty_input = "bss-qty-input";

    function main(config)
    {
        var cartItems = config.data;
        if (cartItems.length === 0) {
            $('form.form-cart .qty input').show();
            return;
        }
        $.each(cartItems, function (key, value) {
            var qtyInputSelector = $("#cart-" + key + "-qty");
            qtyInputSelector.attr(window.bss_qty_input, window.bss_qty_input);
            qtyInputSelector.hide();
            if ($(this).val() === 'custom' || value == '') {
                qtyInputSelector.show();
            }
            if (value != '') {
                var qtyDropdownSelector = $(value).insertBefore(qtyInputSelector).show();
                if ($(this).find('option').last().val() !== 'custom' && $(this).find('option[value=' + qtyInputSelector.val() + ']').length === 0) { // Breeze: find('option:last') => find('option').last()
                    $('<span class="bss-error">' + $.mage.__('Current items qty is') + ' ' + qtyInputSelector.val() + '. ' + $.mage.__('Please update your cart items!') + '</span>').insertAfter(qtyInputSelector);
                    var dropdownValue = $(this).find('option:not([disabled])').first();
                    if (dropdownValue.length > 0 && dropdownValue.val() !== 'custom') {
                        $(qtyInputSelector).val(dropdownValue.val());
                    }
                    qtyInputSelector.trigger('change');
                } else {
                    qtyDropdownSelector.parent().find('.bss-error').remove();
                }
            }
        });
        updateQty();
    }

    function updateQty()
    {
        var bssQtyInputElement = "input[" + window.bss_qty_input + "='" + window.bss_qty_input + "']",
            dropdownElement = "select[" + window.bss_qty_dropdown + "='" + window.bss_qty_dropdown + "']";

        $(dropdownElement).on('change', function () {// Breeze: change() => on('change)
            var valueSelected = $(this).val();
            var qtyElement = $(this).parent().find(bssQtyInputElement);
            if (valueSelected === "custom") {
                qtyElement.show();
            } else {
                qtyElement.hide();
                qtyElement.val(valueSelected);
            }
        });
    }

    main.component = 'Bss_QuantityDropdown/js/cart-dropdown'; // Breeze: added component name

    return main;
});
