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
    'jquery',
    'underscore',
    "mage/translate"
], function ($, _) {
    'use strict';

    var btnAddWishlist = ".action.towishlist";

    $.widget('bss.BssQtyDropdown', {
        component: 'Bss_QuantityDropdown/js/configurable',
        _init: function () {
            var $widget = this;
            window.jsonChildProduct = this.options.jsonChildProduct;
            var qtyElement = this.options.qtyElement.element;
            var dropdownElement = "#product_addtocart_form select[bss-qty-dropdown='bss-qty-dropdown']";
            var selector_product_options_wrapper = $('#product-options-wrapper');

            selector_product_options_wrapper.on('click', '.swatch-option', function () {
                $widget._updateDropdown(dropdownElement);
            });

            selector_product_options_wrapper.on('change', '.super-attribute-select, .swatch-select', function () {
                $widget._updateDropdown(dropdownElement);
            });

            $(document).on("change", dropdownElement, function (e) {
                var valueSelected = this.value;

                if (valueSelected === "custom") {
                    $(qtyElement).show();
                    $(qtyElement).attr('value', 1);
                } else {
                    $(qtyElement).hide();
                    $(qtyElement).attr('value', valueSelected);
                }

                if ($(qtyElement).val() > 0) {
                    $widget._updateDataPostWishlist($(qtyElement).val());
                }
            });
        },

        _updateDataPostWishlist: function (valueSelected) {
            var btn = $(btnAddWishlist);
            var post = btn.data("post");
            post.data.qty = valueSelected;
            btn.data("post", post);
        },

        _updateDropdown: function (dropdownElement) {
            var $widget = this,
                childData = $widget.options.jsonChildProduct.child,
                index;

            var qtyElement = this.options.qtyElement.element;
            setTimeout(function () {
                if ($('.swatch-opt').length > 0) {
                    index = $widget.findSwatchIndex($widget);
                } else {
                    index = $widget.findIndex($widget);
                }
                if (childData.hasOwnProperty(index) && childData[index] != '') {
                    if ($(dropdownElement).length !== 0) {
                        $(dropdownElement).remove();
                    }
                    var dropdownSelector = $(childData[index]).insertBefore(qtyElement);
                    dropdownSelector.show();
                    var dropdownValue = dropdownSelector.find('option:not([disabled])').first();

                    if (dropdownValue.val() > 0) {
                        $widget._updateDataPostWishlist(dropdownValue.val());
                    }

                    if (dropdownValue.length > 0 && dropdownValue.val() !== 'custom') {
                        $(qtyElement).val(dropdownValue.val());
                    }
                    $(qtyElement).hide();
                } else {
                    $(dropdownElement).remove();
                    $(qtyElement).show();
                }
            }, 100);
        },

        findSwatchIndex: function ($widget) {
            var options = {},
                jsonData = $widget.options.jsonChildProduct,
                attributes_count = 0,
                swatchAttributes = $('.swatch-opt').find('.swatch-attribute[data-option-selected]'),
                checkVer = true;

            if (swatchAttributes.length < 1) {
                swatchAttributes = $('.swatch-opt').find('.swatch-attribute[option-selected]');
                checkVer = false;
            }

            swatchAttributes.each(function () {
                if (checkVer) {
                    var attributeId = $(this).attr('data-attribute-id');
                    options[attributeId] = $(this).attr('data-option-selected');
                    attributes_count++;
                } else {
                    var attributeId = $(this).attr('attribute-id');
                    options[attributeId] = $(this).attr('option-selected');
                    attributes_count++;
                }
            });

            if (jsonData.attributes_count === attributes_count) {
                return _.findKey(jsonData.index, options);
            } else {
                return false;
            }
        },

        findIndex: function ($widget) {
            var options = {},
                jsonData = $widget.options.jsonChildProduct,
                attributes_count = 0;
            $('#product-options-wrapper .configurable.field').find('.super-attribute-select').each(function () {
                if ($(this).val() != '') {
                    var attributeId = this.attributeId;
                    options[attributeId] = $(this).val();
                    attributes_count++;
                }
            });
            if (jsonData.attributes_count === attributes_count) {
                return _.findKey(jsonData.index, options);
            } else {
                return false;
            }
        },
    });

    return $.bss.BssQtyDropdown;
});
