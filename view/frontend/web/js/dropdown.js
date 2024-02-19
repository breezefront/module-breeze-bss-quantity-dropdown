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
    window.bss_qty_botton = "bss-qty-button";
    var catalog_product_view = 'catalog_product_view';
    var checkout_cart_configure = 'checkout_cart_configure';
    var wishlist_index_configure = 'wishlist_index_configure';
    var btnAddWishlist = "a[data-action='add-to-wishlist']";
    var inputQtyProduct = "input[bss-qty-input='bss-qty-input']";
    var productItem = ".product.actions.product-item-actions";

    function main(config)
    {
        var handle = config.data.handle,
            productQytInputElement = config.data.product_qty_element,
            productListQytInputElement = config.data.product_list_qty_element,
            addToCartButtonElement = config.data.button_addtocart_element,
            display = config.data.display;
        beforeInsertDropdown(handle, addToCartButtonElement, productQytInputElement, productListQytInputElement, display);
        updateQty();
    }

    function beforeInsertDropdown(
        handle,
        addToCartButtonElement,
        productQytInputElement,
        productListQytInputElement,
        display
    ) {
        if (
            handle === catalog_product_view ||
            handle === checkout_cart_configure ||
            handle === wishlist_index_configure
        ) {
            var dropdownElement = "select[" + window.bss_qty_dropdown + "='" + window.bss_qty_dropdown + "']";
            var mainProduct = false;
            $('.product-info-main ' + dropdownElement).each(function () {
                if ($('#product_addtocart_form').find(dropdownElement).length > 0) {
                    $(this).remove();
                } else {
                    $(this).attr('bss-product', 'main');
                    $(this).val($(productQytInputElement).val());
                    $(this).insertBefore(productQytInputElement).show();
                    mainProduct = true;
                }
            });
            if (mainProduct === false) {
                $(productQytInputElement).show();
            }
            $('.product-info-main ' + productQytInputElement).attr(window.bss_qty_input, window.bss_qty_input);
            setTimeout(function () {
                insertDropdown(addToCartButtonElement, productListQytInputElement, handle, display);
            }, 100);
        } else {
            insertDropdown(addToCartButtonElement, productListQytInputElement, handle, display);
        }
    }

    function insertDropdown(
        addToCartButtonElement,
        productListQytInputElement,
        handle,
        display
    ) {
        var dropdownElement = "select[" + window.bss_qty_dropdown + "='" + window.bss_qty_dropdown + "']";
        $(dropdownElement).each(function () {
            if ($(this).attr('bss-product') === 'main') {
                return true;
            }
            if ((handle === catalog_product_view || handle === checkout_cart_configure) && display == false) {
                $(this).remove();
                return true;
            }
            var obj = $(this),
                inputQtyIsset = false,
                addToCartButton = false,
                inputQty = '<input style="display:none" type="number" name="qty" data-role="qty" ' + window.bss_qty_input + '="' + window.bss_qty_input + '" class="bss-qty" value="' + $(this).val() + '">';

            $.each(addToCartButtonElement, function (key, value) {
                var addToCartButtonCheck = obj.parent().find(value);
                if (addToCartButtonCheck.length > 0) {
                    addToCartButton = addToCartButtonCheck;
                    addToCartButton.attr(window.bss_qty_botton, window.bss_qty_botton);
                    return false;
                }
            });

            if (addToCartButton == false) {
                return false;
            }

            $.each(productListQytInputElement, function (key, value) {
                var inputQtyIssetCheck = obj.parent().find(value);
                if (inputQtyIssetCheck.length > 0) {
                    inputQtyIsset = inputQtyIssetCheck;
                    return false;
                }
            });

            if (inputQtyIsset == false) {
                var bssQtyInputElement = $(inputQty).insertBefore(addToCartButton);
                $(this).insertBefore(bssQtyInputElement).show();

                var item = $(this).parents(productItem),
                    btnWishlist = item.find(btnAddWishlist),
                    valueSelected = item.find(inputQtyProduct).val();

                updateDataPost(addToCartButton, bssQtyInputElement);
                if (btnWishlist.length === 1 && valueSelected > 0) {
                    updateDataPostWishlist(btnWishlist, valueSelected)
                }
            } else {
                $(inputQtyIsset).hide();

                if (this.lastElementChild.className === 'bss-custom') {
                    if (this.lastElementChild.selected) {
                        $(inputQtyIsset).show();
                    }
                }

                inputQtyIsset.attr(window.bss_qty_input, window.bss_qty_input);
                $(this).insertBefore(inputQtyIsset).show();
            }
        });
    }

    function updateDataPostWishlist(btnWishlist, valueSelected)
    {
        var post = btnWishlist.data("post");
        post.data.qty = valueSelected;
        btnWishlist.data("post", post);
    }

    function updateQty()
    {
        var addToCartButtonElement = "button[" + window.bss_qty_botton + "='" + window.bss_qty_botton + "']",
            bssQtyInputElement = "input[" + window.bss_qty_input + "='" + window.bss_qty_input + "']",
            dropdownElement = "select[" + window.bss_qty_dropdown + "='" + window.bss_qty_dropdown + "']";

        $(dropdownElement).on('change', function () { // Breeze: change() => on('change')
            var btnWishlist = $(this).parents(productItem).find(btnAddWishlist),
                valueSelected = $(this).val(),
                qtyElement = $(this).parent().find(bssQtyInputElement);

            if (valueSelected === "custom") {
                qtyElement.show();
                qtyElement.val(1);
            } else {
                qtyElement.hide();
                qtyElement.val(valueSelected);
                qtyElement.trigger('change');
            }

            if (btnWishlist.length === 1 && qtyElement.val() > 0) {
                updateDataPostWishlist(btnWishlist, qtyElement.val())
            }
        });

        $(bssQtyInputElement).on('change', function () { // Breeze: change() => on('change')
            var addToCartButton = $(this).parent().find(addToCartButtonElement);
            if (addToCartButton.length > 0) {
                updateDataPost(addToCartButton, $(this));
            }
        });

        $(bssQtyInputElement).on('keyup', function () { // Breeze: keyup() => on('keyup')
            var addToCartButton = $(this).parent().find(addToCartButtonElement),
                btnWishlist = $(this).parents(productItem).find(btnAddWishlist),
                valueSelected = $(this).parent().find(bssQtyInputElement).val();

            if (addToCartButton.length > 0) {
                updateDataPost(addToCartButton, $(this));
                if (btnWishlist.length === 1 && valueSelected > 0) {
                    updateDataPostWishlist(btnWishlist, valueSelected)
                }
            }
        });
    }

    function updateDataPost(
        addToCartButton,
        qtyElement
    ) {
        var dataPost = addToCartButton.attr('data-post');
        if (dataPost) {
            dataPost = JSON.parse(dataPost);
            dataPost.data['qty'] = qtyElement.val();
            dataPost = JSON.stringify(dataPost);
            addToCartButton.attr('data-post', dataPost);
        }
    }

    main.component = 'Bss_QuantityDropdown/js/dropdown'; // Breeze: added component name

    return main;
});
