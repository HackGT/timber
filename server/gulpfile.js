/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require("gulp");
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

// Default task
gulp.task("default", gulp.series("clean", "build"));
