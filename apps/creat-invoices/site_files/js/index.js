app.controller("creat_invoices", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.creat_invoices = {};

  $scope.displayAddCreatInvoices = function () {
    $scope._search = {};
    $scope.search_order = "";
    $scope.error = '';
    $scope.creat_invoices = {
      image_url: '/images/creat_invoices.png',
      source_type: {
        id: 2,
        en: "Order Invoices",
        ar: "شاشة الطلبات"
      },
      payment_method: {
        id: 1,
        en: "Cash",
        ar: "كاش"
      },
      date: new Date(),
      active: true
    };
    site.showModal('#creatInvoicesAddModal');
  };

  $scope.addCreatInvoices = function () {
    if ($scope.busy) {
      return;
    }
    $scope.error = '';
    $scope.busy = true;
    const v = site.validated('#creatInvoicesAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    if ($scope.creat_invoices.paid_up > 0 && !$scope.creat_invoices.safe) {
      $scope.error = "##word.should_select_safe##";
      return;
    }
     if ($scope.creat_invoices.order_sale && $scope.creat_invoices.total_tax > $scope.creat_invoices.order_sale.under_paid.total_tax) {
      $scope.error = "##word.err_total_tax##";
      return;
    }
     if ($scope.creat_invoices.order_sale && $scope.creat_invoices.total_discount > $scope.creat_invoices.order_sale.under_paid.total_discount) {
      $scope.error = "##word.err_total_discount##";
      return;
    }
     if ($scope.creat_invoices.order_sale && $scope.creat_invoices.price_delivery_service > $scope.creat_invoices.order_sale.under_paid.price_delivery_service) {
      $scope.error = "##word.err_price_delivery_service##";
      return;
    } 
    if ($scope.creat_invoices.order_sale && $scope.creat_invoices.service > $scope.creat_invoices.order_sale.under_paid.service) {
      $scope.error = "##word.err_service##";
      return;
    }
     if ($scope.creat_invoices.order_sale && $scope.creat_invoices.net_value > $scope.creat_invoices.order_sale.under_paid.net_value) {
      $scope.error = "##word.err_net_value##";
      return;
    }

    $http({
      method: "POST",
      url: "/api/creat_invoices/add",
      data: $scope.creat_invoices
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#creatInvoicesAddModal');
          $scope.getCreatInvoicesList();
        } else {
          $scope.error = response.data.error;
          if (response.data.error.like('*duplicate key error*')) {
            $scope.error = "##word.code_exisit##"
          } else if (response.data.error.like('*Please write code*')) {
            $scope.error = "##word.enter_code_inventory##"
          }
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayUpdateCreatInvoices = function (creat_invoices) {
    $scope._search = {};

    $scope.error = '';
    $scope.detailsCreatInvoices(creat_invoices);
    $scope.creat_invoices = {
      image_url: '/images/vendor_logo.png',

    };
    site.showModal('#creatInvoicesUpdateModal');
  };

  $scope.updateCreatInvoices = function () {
    if ($scope.busy) {
      return;
    }
    $scope.error = '';
    $scope.busy = true;

    const v = site.validated('#creatInvoicesUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $http({
      method: "POST",
      url: "/api/creat_invoices/update",
      data: $scope.creat_invoices
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#creatInvoicesUpdateModal');
          $scope.list.forEach((b, i) => {
            if (b.id == response.data.doc.id) {
              $scope.list[i] = response.data.doc;
            }
          });
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDetailsCreatInvoices = function (creat_invoices) {
    $scope.error = '';
    $scope.detailsCreatInvoices(creat_invoices);
    $scope.creat_invoices = {};
    site.showModal('#creatInvoicesDetailsModal');
  };

  $scope.detailsCreatInvoices = function (creat_invoices) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/creat_invoices/view",
      data: {
        id: creat_invoices.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          response.data.doc.date = new Date(response.data.doc.date);
          $scope.creat_invoices = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDeleteCreatInvoices = function (creat_invoices) {
    $scope.error = '';
    $scope.detailsCreatInvoices(creat_invoices);
    $scope.creat_invoices = {};
    site.showModal('#creatInvoicesDeleteModal');
  };

  $scope.deleteCreatInvoices = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/creat_invoices/delete",
      data: {
        id: $scope.creat_invoices.id

      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#creatInvoicesDeleteModal');
          $scope.list.forEach((b, i) => {
            if (b.id == response.data.doc.id) {
              $scope.list.splice(i, 1);
              $scope.count -= 1;
            }
          });
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.getCreatInvoicesList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $http({
      method: "POST",
      url: "/api/creat_invoices/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.paymentInvoice = function () {
    if (!$scope.current.payment_safe.id) {
      $scope.error = "##word.should_select_safe##";
      return;
    };
    if (!$scope.current.payment_paid_up) {
      $scope.error = "##word.err_paid_up##";
      return;
    };
    if ($scope.current.payment_paid_up > $scope.current.remain_amount) {
      $scope.error = "##word.err_paid_up_payment##";
      return;
    };
    $scope.current.payment_list = $scope.current.payment_list || [];
    $scope.current.remain_amount = $scope.current.remain_amount - $scope.current.payment_paid_up;
    $scope.current.payment_list.push({
      paid_up: $scope.current.payment_paid_up,
      safe: $scope.current.payment_safe,
      date: $scope.current.payment_date,
    });
  };

  $scope.acceptPaymentInvoice = function () {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/creat_invoices/update",
      data: $scope.current
    }).then(
      function (response) {
        $scope.busy = false;

        if (response.data.done) {

          $scope.getCreatInvoicesList();
          site.hideModal('#invoicesPaymentModal');
        } else {
          $scope.error = 'Please Login First';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.loadOrderInvoicesType = function (ev) {
    $scope.busy = true;
    $scope.orderInvoicesTypeList = [];
    if (ev.which === 13) {

      $http({
        method: "POST",
        url: "/api/order_invoice/invoices",
        data: {
          search: $scope.search_order
          /* ,
          where: {
            transaction_type: order_invoices_type.id
          } */
        }
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data.done) {
            $scope.orderInvoicesTypeList = response.data.list;

          }
        },
        function (err) {
          $scope.busy = false;
          $scope.error = err;
        }
      )
    };
  };

  $scope.selectOrderInvoices = function (item) {
    $scope.creat_invoices.current_book_list = [];
    $scope.creat_invoices.total_tax = item.under_paid.total_tax;
    $scope.creat_invoices.total_discount = item.under_paid.total_discount;
    $scope.creat_invoices.price_delivery_service = item.under_paid.price_delivery_service;
    $scope.creat_invoices.service = item.under_paid.service;
    $scope.creat_invoices.net_value = item.under_paid.net_value;
    $scope.creat_invoices.order_invoices_id = item.under_paid.order_invoice_id;

    item.under_paid.book_list.forEach(item => {
      if (item.count > 0) {

        $scope.creat_invoices.current_book_list.push(item);
      }
    });
    $scope.orderInvoicesTypeList = [];
  };

  $scope.displayPaymentInvoices = function (invoices) {
    $scope.error = '';
    $scope.current = invoices;
    $scope.current.payment_date = new Date();
    $scope.current.payment_paid_up = 0;
    $scope.current.payment_safe = {};

    site.showModal('#invoicesPaymentModal');
  };

  /*  $scope.remaining = function () {
     let order_sale = $scope.creat_invoices.order_sale;
     order_sale.under_paid.total_tax = order_sale.under_paid.total_tax - $scope.creat_invoices.total_tax;
     order_sale.under_paid.total_discount = order_sale.under_paid.total_discount - $scope.creat_invoices.total_discount;
     order_sale.under_paid.price_delivery_service = order_sale.under_paid.price_delivery_service - $scope.creat_invoices.price_delivery_service;
     order_sale.under_paid.service = order_sale.under_paid.service - $scope.creat_invoices.service;
     order_sale.under_paid.net_value = order_sale.under_paid.net_value - $scope.creat_invoices.net_value;
     order_sale.under_paid.book_list.forEach(order_item => {
       $scope.creat_invoices.current_book_list.forEach(current_item => {
         if (order_item.barcode == current_item.barcode) {
           order_item.count = order_item.count - current_item.count;
         };
       });
     });
     $http({
       method: "POST",
       url: "/api/order_invoice/invoices_update",
       data: order_sale
     })
   }; */

  $scope.calc = function () {
    $timeout(() => {
      let total_price_item = 0;
      $scope.creat_invoices.current_book_list.forEach(item => {

        total_price_item += item.total_price;
      });
      $scope.creat_invoices.net_value = total_price_item + ($scope.creat_invoices.service || 0) + ($scope.creat_invoices.price_delivery_service || 0) + ($scope.creat_invoices.total_tax || 0) - ($scope.creat_invoices.total_discount || 0)
    }, 250);
  };
  $scope.deleteItemsList = function (item) {
    $scope.error = '';

    if (item.count == 1) {
      $scope.creat_invoices.current_book_list.splice($scope.creat_invoices.current_book_list.indexOf(item), 1)

    } else if (item.count > 1) {
      item.count -= 1;
      item.total_price -= item.price;
      return item
    }
    item.total_price = item.count * item.price;
  };

  $scope.getTransactionTypeList = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.transactionTypeList = [];
    $http({
      method: "POST",
      url: "/api/order_invoice/transaction_type/all"

    }).then(
      function (response) {
        $scope.busy = false;
        $scope.transactionTypeList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getPaymentMethodList = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.paymentMethodList = [];
    $http({
      method: "POST",
      url: "/api/payment_method/all"

    }).then(
      function (response) {
        $scope.busy = false;
        $scope.paymentMethodList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getSourceType = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.sourceTypeList = [];
    $http({
      method: "POST",
      url: "/api/source_type/all"
    }).then(
      function (response) {
        $scope.busy = false;
        $scope.sourceTypeList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.getSafesList = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/safes/all",
      data: {}
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.safesList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.searchAll = function () {
    $scope._search = {};
    $scope.getCreatInvoicesList($scope.search);
    site.hideModal('#creatInvoicesSearchModal');
    $scope.search = {}

  };

  /*   $scope.getScreenType = function () {
      $scope.busy = true;
  
      $http({
        method: "POST",
        url: "/api/numbering_transactions_status/get",
        data: {
          screen_name: "creat_invoices"
        }
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data) {
            $scope.disabledCode = response.data.doc == 'auto' ? true : false;
          }
        },
        function (err) {
          $scope.busy = false;
          $scope.error = err;
        }
      )
    };
    $scope.getScreenType(); */
  $scope.getCreatInvoicesList();
  $scope.getSourceType();
  $scope.getTransactionTypeList();
  $scope.getSafesList();
  $scope.getPaymentMethodList();
});