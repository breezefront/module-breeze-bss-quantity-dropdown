(function () {
    'use strict';

    $.mixin('priceBox', {
        _create: function()
        {
            var box = this.element;

            this.cache = {};
            this._setDefaultsFromPriceConfig();
            this._setDefaultsFromDataSet();

            box.on('reloadPrice', this.reloadPrice.bind(this));
            box.on('updatePrice', this.onUpdatePrice.bind(this));
        },
        updatePrice: function(original, newPrices)
        {
            var prices = this.cache.displayPrices,
                additionalPrice = {},
                pricesCode = [],
                priceValue, origin, finalPrice;

            this.cache.additionalPriceObject = this.cache.additionalPriceObject || {};

            if (newPrices) {
                $.extend(this.cache.additionalPriceObject, newPrices);
            }

            if (!_.isEmpty(additionalPrice)) {
                pricesCode = _.keys(additionalPrice);
            } else if (!_.isEmpty(prices)) {
                pricesCode = _.keys(prices);
            }
            _.each(this.cache.additionalPriceObject, function (additional) {
                if (additional && !_.isEmpty(additional)) {
                    pricesCode = _.keys(additional);
                }

                _.each(pricesCode, function (priceCode) {
                    priceValue = additional[priceCode] || {};
                    priceValue.amount = +priceValue.amount || 0;
                    priceValue.adjustments = priceValue.adjustments || {};

                    additionalPrice[priceCode] = additionalPrice[priceCode] || {
                        'amount': 0,
                        'adjustments': {}
                    };
                    additionalPrice[priceCode].amount = (additionalPrice[priceCode].amount || 0) +
                        priceValue.amount;
                    _.each(priceValue.adjustments, function (adValue, adCode) {
                        additionalPrice[priceCode].adjustments[adCode] = 0 +
                            (additionalPrice[priceCode].adjustments[adCode] || 0) + adValue;
                    });

                });
            });

            if (_.isEmpty(additionalPrice)) {
                this.cache.displayPrices = $.catalog.priceUtils.deepClone(this.options.prices);
            } else {
                _.each(additionalPrice, function (option, priceCode) {
                    origin = this.options.prices[priceCode] || {};
                    finalPrice = prices[priceCode] || {};
                    option.amount = option.amount || 0;
                    origin.amount = origin.amount || 0;
                    origin.adjustments = origin.adjustments || {};
                    finalPrice.adjustments = finalPrice.adjustments || {};

                    finalPrice.amount = 0 + origin.amount + option.amount;
                    _.each(option.adjustments, function (pa, paCode) {
                        finalPrice.adjustments[paCode] = 0 + (origin.adjustments[paCode] || 0) + pa;
                    });
                    if (priceCode === 'finalPrice') {
                        $("select[bss-qty-dropdown='bss-qty-dropdown']").find('option').each(function () {
                            var tprice;
                            var select = $(this).text();
                            var arr = select.split(" ");
                            if (typeof (arr[2]) != 'undefined') {
                                if (arr[2].match(/\d+/g) != null) {
                                    tprice = $(this).attr('data-unit-price');
                                    arr[2] = $.catalog.priceUtils.formatPrice(+tprice + +option.amount);
                                    select = arr[0] + " " + arr[1] + " " + arr[2] + " " + arr[3];
                                    $(this).text(select);
                                } else {
                                    tprice = $(this).attr('data-unit-price');
                                    var qty = $(this).attr('value');
                                    arr[3] = $.catalog.priceUtils.formatPrice((+tprice + +option.amount) * (+qty));
                                    select = arr[0] + " " + arr[1] + " " + arr[2] + " " + arr[3];
                                    $(this).text(select);
                                }
                            }
                        });
                    }
                }, this);
            }

            this.element.trigger('reloadPrice');
            $("select[bss-qty-dropdown='bss-qty-dropdown']").trigger('change');
        }
    });
})();
