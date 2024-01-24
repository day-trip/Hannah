var e = function (n) {
    var e = "", r = "";
    if (n && "" !== n) {
        var o = decodeURIComponent(n);
        if ((r = JSON.parse(o)).appResponse.advance_sso) {
            var i = r.appResponse.advance_sso_json;
            if (r.appResponse.userauth && r.appResponse.userauth.length > 0) for (var u in r.appResponse.userauth[0]) try {
                r.appResponse.userauth[0][u] = CryptoJS.AES.decrypt(r.appResponse.userauth[0][u], r.gwstokenMd5).toString(CryptoJS.enc.Utf8)
            } catch (t) {
                r.appResponse.userauth[0][u] = r.appResponse.userauth[0][u]
            }
            for (var c = 0; c < r.appResponse.selectors.length; c++) {
                var a = CryptoJS.AES.decrypt(r.appResponse.selectors[c].value, r.gwstokenMd5).toString(CryptoJS.enc.Utf8);
                if (r.appResponse.userauth && 0 == r.appResponse.userauth.length) {
                    var s = {};
                    s[r.appResponse.selectors[c].sel] = a, r.appResponse.userauth.push(s)
                } else r.appResponse.userauth[0][r.appResponse.selectors[c].sel] || (r.appResponse.userauth[0][r.appResponse.selectors[c].sel] = a)
            }
            r.appResponse.userauth && r.appResponse.userauth.length > 0 && (i.auth = r.appResponse.userauth[0]), chrome.runtime.sendMessage(chrome.runtime.id, {
                type: "initiate-sso-tasks", data: i
            }), setTimeout((function () {
                t("#clloginProcess").remove()
            }), 3e3)
        } else setTimeout((function () {
            r.appResponse.pre_auth_script = r.appResponse.pre_auth_script || "", r.appResponse.preauth_delay = r.appResponse.preauth_delay || "", r.appResponse.post_auth_script = r.appResponse.post_auth_script || "", r.appResponse.postauth_delay = r.appResponse.postauth_delay || "", console.log(r.appResponse);
            var n = function () {
                var n = !1;
                if (r.appResponse.userauth.length > 0) for (var o = 0; o < r.appResponse.selectors.length; o++) "text" != r.appResponse.selectors[o].type && "password" != r.appResponse.selectors[o].type || (r.appResponse.selectors[o].value = r.appResponse.userauth[0][r.appResponse.selectors[o].sel]);
                for (var i = 0; i < r.appResponse.selectors.length; i++) {
                    var u;
                    u = r.appResponse.selectors[i].value;
                    var c = CryptoJS.AES.decrypt(u, r.gwstokenMd5).toString(CryptoJS.enc.Utf8);
                    "" != c || n || (n = !0), "submit" == r.appResponse.selectors[i].type ? e = r.appResponse.selectors[i].sel : t(r.appResponse.selectors[i].sel.replace(":", "")).val(c)
                }
                r.appResponse.selectors.length > 0 && ("" == e ? t(r.appResponse.selectors[0].sel).closest("form").submit() : t(e).trigger("click"), function () {
                    r.appResponse.postauth_delay = r.appResponse.postauth_delay ? r.appResponse.postauth_delay : 0;
                    var t = r.appResponse.post_auth_script, n = function () {
                        var n = "(function() { " + t + "})();", e = document.createElement("script");
                        e.textContent = n, (document.head || document.documentElement).appendChild(e), e.remove()
                    };
                    "" != r.appResponse.postauth_delay && "" != r.appResponse.post_auth_script ? setTimeout((function () {
                        n()
                    }), r.appResponse.postauth_delay) : "" != r.appResponse.post_auth_script && n()
                }(), setTimeout((function () {
                    t("#clloginProcess").remove()
                }), 2e3))
            };
            "" != r.appResponse.pre_auth_script || "" != r.appResponse.preauth_delay ? function () {
                r.appResponse.preauth_delay = r.appResponse.preauth_delay ? r.appResponse.preauth_delay : 0;
                var t = r.appResponse.pre_auth_script, e = function () {
                    var n = "(function() { " + t + "})();", e = document.createElement("script");
                    e.textContent = n, (document.head || document.documentElement).appendChild(e), e.remove()
                };
                "" != r.appResponse.preauth_delay && "" != t ? setTimeout((function () {
                    e(), n()
                }), r.appResponse.preauth_delay) : "" != r.appResponse.preauth_delay && "" == t ? setTimeout((function () {
                    n()
                }), r.appResponse.preauth_delay) : "" == r.appResponse.preauth_delay && "" != t && (e(), n())
            }() : n()
        }), 1e3)
    }
}