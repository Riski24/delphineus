var gulp=require("gulp"),uglify=require("gulp-uglify");gulp.task("minify-js",function(){gulp.src("./*.js").pipe(uglify()).pipe(gulp.dest("./popupmin.js"))});