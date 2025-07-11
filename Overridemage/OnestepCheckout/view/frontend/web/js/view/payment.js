define([
    'ko',
    'Magento_Checkout/js/model/payment-service',
    'Magento_Checkout/js/view/payment',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/action/select-payment-method',
    'Magento_Checkout/js/checkout-data'
], function(ko, paymentService, Payment, quote, selectPaymentMethodAction, checkoutData) {
        'use strict';

        return Payment.extend({
            isVisible: ko.observable(true),

            updateRegion: function (items, name) {

                if (name == 'afterMethods') {
                    items.forEach(function(item){
                        item.removeChild('discount');
                    });
                }
                this.getRegion(name)(items);

                return this;
            },

            initialize: function() {
                this._super();
                console.log('Payment Methods:', paymentService.getAvailablePaymentMethods());
                // Force visibility
                this.isVisible(true);
                this.navigate();
                this.setDefaultMethod();

                return this;
            },
            setDefaultMethod: function () {
                try {
                    var methods = paymentService.getAvailablePaymentMethods();
                    console.log('Available Methods:', methods);

                    if (methods && methods.length > 0) {
                        if (!quote.paymentMethod()) {
                            var defaultMethod = checkoutData.getSelectedPaymentMethod();
                            if (!defaultMethod) {
                                defaultMethod = methods[0].method;
                            }

                            var method = methods.find(function(method) {
                                return method.method === defaultMethod;
                            });

                            if (method) {
                                console.log('Setting default method:', method);
                                selectPaymentMethodAction(method);
                                checkoutData.setSelectedPaymentMethod(method.method);
                            }
                        }
                    } else {
                        console.warn('No payment methods available');
                    }
                } catch (error) {
                    console.error('Error in setDefaultMethod:', error);
                }
            },
            // setDefaultMethod: function () {
            //     if (quote.paymentMethod())
            //         return;
            //
            //     var methods = paymentService.getAvailablePaymentMethods();
            //
            //     if (methods.length == 0)
            //         return;
            //
            //     var defaultMethod = checkoutData.getSelectedPaymentMethod();
            //     if (!defaultMethod)
            //         return;
            //
            //     var method = methods.find(function (method) {
            //         return method.method == defaultMethod;
            //     });
            //
            //     if (method) {
            //         selectPaymentMethodAction(method);
            //         checkoutData.setSelectedPaymentMethod(method.method);
            //     }
            // }
        });
    }
);
