!function (e) {
    "use strict";

    function t() {
        e("#inline-username").editable("destroy"), e("#inline-firstname").editable("destroy"), e("#inline-sex").editable("destroy"), e("#inline-status").editable("destroy"), e("#inline-group").editable("destroy"), e("#inline-dob").editable("destroy"), e("#inline-event").editable("destroy"), e("#inline-comments").editable("destroy"), e("#inline-fruits").editable("destroy")
    }

    e(document).ready(function () {
        e("#inline-username").editable({
            type: "text",
            pk: 1,
            name: "username",
            title: "Enter username",
            mode: "inline"
        }), e("#inline-firstname").editable({
            validate: function (t) {
                return "" == e.trim(t) ? "This field is required" : void 0
            }, mode: "inline"
        }), e("#inline-sex").editable({
            prepend: "not selected",
            mode: "inline",
            source: [{value: 1, text: "Male"}, {value: 2, text: "Female"}],
            display: function (t, n) {
                var i = {"": "#98a6ad", 1: "#5fbeaa", 2: "#5d9cec"}, a = e.grep(n, function (e) {
                    return e.value == t
                });
                a.length ? e(this).text(a[0].text).css("color", i[t]) : e(this).empty()
            }
        }), e("#inline-status").editable({mode: "inline"}), e("#inline-group").editable({
            showbuttons: !1,
            mode: "inline"
        }), e("#inline-dob").editable({mode: "inline"}), e("#inline-event").editable({mode: "inline"}), e("#inline-comments").editable({
            showbuttons: "bottom",
            mode: "inline"
        }), e("#inline-fruits").editable({
            pk: 1,
            limit: 3,
            source: [{value: 1, text: "banana"}, {value: 2, text: "peach"}, {value: 3, text: "apple"}, {
                value: 4,
                text: "watermelon"
            }, {value: 5, text: "orange"}],
            mode: "inline"
        })
    }), e("#switch-inline").on("change", function () {
        e(this).prop("checked") ? (t(), e("#inline-username").editable({
            type: "text",
            pk: 1,
            name: "username",
            title: "Enter username",
            mode: "inline"
        }), e("#inline-firstname").editable({
            validate: function (t) {
                return "" == e.trim(t) ? "This field is required" : void 0
            }, mode: "inline"
        }), e("#inline-sex").editable({
            prepend: "not selected",
            mode: "inline",
            source: [{value: 1, text: "Male"}, {value: 2, text: "Female"}],
            display: function (t, n) {
                var i = {"": "#98a6ad", 1: "#5fbeaa", 2: "#5d9cec"}, a = e.grep(n, function (e) {
                    return e.value == t
                });
                a.length ? e(this).text(a[0].text).css("color", i[t]) : e(this).empty()
            }
        }), e("#inline-status").editable({mode: "inline"}), e("#inline-group").editable({
            showbuttons: !1,
            mode: "inline"
        }), e("#inline-dob").editable({mode: "inline"}), e("#inline-event").editable({mode: "inline"}), e("#inline-comments").editable({
            showbuttons: "bottom",
            mode: "inline"
        }), e("#inline-fruits").editable({
            pk: 1,
            limit: 3,
            source: [{value: 1, text: "banana"}, {value: 2, text: "peach"}, {value: 3, text: "apple"}, {
                value: 4,
                text: "watermelon"
            }, {value: 5, text: "orange"}],
            mode: "inline"
        })) : (t(), e("#inline-username").editable({
            type: "text",
            pk: 1,
            name: "username",
            title: "Enter username"
        }), e("#inline-firstname").editable({
            validate: function (t) {
                return "" == e.trim(t) ? "This field is required" : void 0
            }
        }), e("#inline-sex").editable({
            prepend: "not selected",
            source: [{value: 1, text: "Male"}, {value: 2, text: "Female"}],
            display: function (t, n) {
                var i = {"": "#98a6ad", 1: "#5fbeaa", 2: "#5d9cec"}, a = e.grep(n, function (e) {
                    return e.value == t
                });
                a.length ? e(this).text(a[0].text).css("color", i[t]) : e(this).empty()
            }
        }), e("#inline-status").editable(), e("#inline-group").editable({showbuttons: !1}), e("#inline-dob").editable(), e("#inline-event").editable(), e("#inline-comments").editable({showbuttons: "bottom"}), e("#inline-fruits").editable({
            pk: 1,
            limit: 3,
            source: [{value: 1, text: "banana"}, {value: 2, text: "peach"}, {value: 3, text: "apple"}, {
                value: 4,
                text: "watermelon"
            }, {value: 5, text: "orange"}]
        }))
    })
}(jQuery);