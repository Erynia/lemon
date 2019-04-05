const [
    gulp,
	gulprename,
    gulpsass,
    gulpServer	
] = [
    require("gulp"),
	require("gulp-rename"),
    require("gulp-sass"),
    require("gulp-webserver")
]

gulp.task("devCss",() => {
    return gulp.src("./src/scss/!(common)*.scss")
    .pipe(gulpsass())
	.pipe(gulprename({
		suffix: ".min"
	}))
    .pipe(gulp.dest("./src/css"))
})

gulp.task("watchDev",() => {
    let filePath = [
        "./src/scss/*.scss"
    ],taskName = [
        "devCss"
    ];
    gulp.watch(filePath,gulp.series(taskName))
})
gulp.task("webserver",() => {
    return gulp.src("./src/")
    .pipe(gulpServer({
        port: 5555,
		livereload: true,
		fallback:"login.html",
        proxies: [
       	    {source:"/api/login",target:"http://localhost:3000/login"},
			{source:"/api/register",target:"http://localhost:3000/register"},
            {source:"/api/bill_list",target:"http://localhost:3000/users/bill_list"},
            {source:"/api/bill_class",target:"http://localhost:3000/users/bill_class"},
            {source:"/api/add_bill",target:"http://localhost:3000/users/add_bill"},
            {source:"/api/delete_bill",target:"http://localhost:3000/users/delete_bill"}
        ]
    }))
})

gulp.task("dev",gulp.parallel("watchDev","webserver"))