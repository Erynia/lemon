require.config({
    baseUrl: "/js",
    paths:{
        axios: "libs/axios",
        ajax: "libs/ajax",
        mui:"libs/mui.min",
        flexible: "libs/flexible",
        utils: "libs/utils",
        picker: "libs/mui.picker.min",
        poppicker: "libs/mui.poppicker",
    },
    shim: {
        picker: {
            deps: ["mui"]
        }
    }
})
