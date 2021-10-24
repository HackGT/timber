/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require("gulp");
const gulpCopy = require("gulp-copy");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");

const tsProject = ts.createProject("./tsconfig.json");

// Clean dist folder
gulp.task("clean", () => del("dist"));

// Build ts
gulp.task("build", () =>
  gulp
    .src("src/**/*.ts")
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: "../src" }))
    .pipe(gulp.dest("dist"))
);

// Copy files
gulp.task("copy", () =>
  gulp.src(["./src/config/*", "./src/public/*"]).pipe(gulpCopy("dist", { prefix: 1 }))
);

// Default task
gulp.task("default", gulp.series("clean", "build", "copy"));
