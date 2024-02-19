(function () {
    'use strict';

    window.bss_qty_dropdown = "bss-qty-dropdown";
    window.bss_qty_input = "bss-qty-input";
    var btnAddWishlist = "a[data-action='add-to-wishlist']";
    var inputQtyProduct = "input[bss-qty-input='bss-qty-input']";
    var productItem = ".product.actions.product-item-actions";

    $.mixin('SwatchRenderer', {
        _OnClick: function (original, $this, $widget) {
            original($this, $widget);
            if (!(this.options.jsonConfig.productQtyDropdown === undefined)) {
                $widget._RemoveDropdown($this);
                $widget._BeforeInsertDropdown($this);
            }

            var item = $(this).parents(productItem),
                btnWishlist = item.find(btnAddWishlist),
                valueSelected = item.find(inputQtyProduct).val(),
                bssQtyInputElement = "input[" + window.bss_qty_input + "='" + window.bss_qty_input + "']",
                dropdownElement = "select[" + window.bss_qty_dropdown + "='" + window.bss_qty_dropdown + "']";

            if (btnWishlist.length === 1 && valueSelected > 0) {
                $widget._updateDataPostWishlist(btnWishlist, valueSelected);
            }

            $(dropdownElement).on('change', function () {
                valueSelected = $(this).val();
                btnWishlist = $(this).parents(productItem).find(btnAddWishlist);
                var qtyElement = $(this).parent().find(bssQtyInputElement);

                if (valueSelected === "custom") {
                    qtyElement.show();
                    qtyElement.val(1);
                } else {
                    qtyElement.hide();
                    qtyElement.val(valueSelected);
                    qtyElement.trigger('change');
                }

                if (btnWishlist.length === 1 && valueSelected > 0) {
                    $widget._updateDataPostWishlist(btnWishlist, qtyElement.val());
                }
            });

            $(bssQtyInputElement).on('keyup', function () {
                valueSelected = $(this).val();
                if (btnWishlist.length === 1 && valueSelected > 0) {
                    $widget._updateDataPostWishlist(btnWishlist, valueSelected);
                }
            });
        },

        _updateDataPostWishlist: function (btnWishlist, valueSelected) {
            var post = btnWishlist.data("post");
            post.data.qty = valueSelected;
            btnWishlist.data("post", post);
        },

        _OnChange: function (original, $this, $widget) {
            original($this, $widget);
            if (!(this.options.jsonConfig.productQtyDropdown === undefined)) {
                $widget._BeforeInsertDropdown($this);
            }
        },

        _BeforeInsertDropdown: function ($this) {
            var $widget = this,
                index = '',
                childProductData = this.options.jsonConfig.productQtyDropdown,
                entity = childProductData.entity,
                $class = '';
            $class = '.swatch-opt-' + entity;
            if ($($class).length > 0) {
                index = $widget.findSwatchIndex($widget, $class);
            } else {
                index = $widget.findIndex($widget);
            }
            $widget._UpdateDropdown(
                $this,
                childProductData['child'][index],
            );
        },

        _UpdateDropdown: function (widget, html) {
            $(widget).parents('.product-item').find('button').before(html);
            var product = $(widget).parents('.product-item').find('select'),
                inputQty = '<input style="display:none" type="number" name="qty" data-role="qty" '
                    + window.bss_qty_input + '="' + window.bss_qty_input + '" class="bss-qty" value="' + product.val() + '">';
            $(widget).parents('.product-item').find('select').attr('style', '', '');
                $(widget).parents('.product-item').find('button').before(inputQty);
        },

        _RemoveDropdown: function (widget) {
            var dropdownSelect = $(widget).parents('.product-item').find('select'),
                inputQty = $(widget).parents('.product-item').find('.bss-qty');
            if (dropdownSelect.length > 0) {
                dropdownSelect.remove();
            }
            if (inputQty.length > 0) {
                inputQty.remove();
            }
        },

        findSwatchIndex: function ($widget, $class) {
            var options = {},
                jsonData = this.options.jsonConfig.productQtyDropdown,
                attributes_count = 0,
                swatchAttributes = $($class).find('.swatch-attribute[data-option-selected]'),
                checkVer = true;

            if (swatchAttributes.length < 1) {
                swatchAttributes = $($class).find('.swatch-attribute[option-selected]');
                checkVer = false;
            }

            swatchAttributes.each(
                function () {
                    if (checkVer) {
                        var attributeId = $(this).attr('data-attribute-id');
                        options[attributeId] = $(this).attr('data-option-selected');
                        attributes_count++;
                    } else {
                        var attributeId = $(this).attr('attribute-id');
                        options[attributeId] = $(this).attr('option-selected');
                        attributes_count++;
                    }
                }
            );

            if (jsonData.attributes_count === attributes_count) {
                return _.findKey(jsonData.index, options);
            } else {
                return false;
            }
        },

        findIndex: function ($widget) {
            var options = {},
                jsonData = this.options.jsonConfig.productQtyDropdown,
                attributes_count = 0;
            $('body').find('.super-attribute-select').each(
                function () {
                    if ($(this).val() != '') {
                        var attributeId = $(this).parents('.swatch-attribute').attr('data-attribute-id');

                        if (!attributeId) {
                            attributeId = $(this).parents('.swatch-attribute').attr('attribute-id');
                        }

                        options[attributeId] = $(this).val();
                        attributes_count++;
                    }
                }
            );
            if (jsonData.attributes_count === attributes_count) {
                return _.findKey(jsonData.index, options);
            } else {
                return false;
            }
        }
    });
})();
