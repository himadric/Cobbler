/// <vs SolutionOpened='Auto-Publish-Css-Local, Auto-Publish-js-Local, Auto-Publish-Views-Local' />
/// <binding AfterBuild='Publish-Assemblies' ProjectOpened='Auto-Publish-Css, Auto-Publish-Views' />
var gulp = require("gulp");
var msbuild = require("gulp-msbuild");
var debug = require("gulp-Debug");
var foreach = require("gulp-foreach");
var rename = require("gulp-rename");
var watch = require("gulp-watch");
var newer = require("gulp-newer");
var util = require("gulp-util");
var runSequence = require('run-sequence');
var fs = require("fs");
var path = require("path");
var config = require("./gulp-config.js")();
var items = [];

var exec = require('child_process').exec;

//Scripts for Local Environment
gulp.task("Publish-Cobbler-Local", function() {
    var destCobbler = config.cobblerWebsiteRootLocal;
    console.log("publish to " + destCobbler + " folder");
    gulp.src("**/Cobbler.Web.csproj")
        .pipe(debug({ title: "Building project:" }))
        .pipe(msbuild({
            targets: ["Clean", "Build"],
            configuration: "Debug",
            logCommand: false,
            verbosity: "minimal",
            maxcpucount: 0,
            toolsVersion: 12.0,
            properties: {
                DeployOnBuild: "true",
                DeployDefaultTarget: "WebPublish",
                WebPublishMethod: "FileSystem",
                DeleteExistingFiles: "false",
                publishUrl: destCobbler
            }
        }));
});

gulp.task("Publish-Elf-Local", function () {
    var destElf = config.elfWebsiteRootLocal;
    console.log("publish to " + destElf + " folder");
    gulp.src("**/Elf.WebApi.csproj")
        .pipe(debug({ title: "Building project:" }))
        .pipe(msbuild({
            targets: ["Clean", "Build"],
            configuration: "Debug",
            logCommand: false,
            verbosity: "minimal",
            maxcpucount: 0,
            toolsVersion: 12.0,
            properties: {
                DeployOnBuild: "true",
                DeployDefaultTarget: "WebPublish",
                WebPublishMethod: "FileSystem",
                DeleteExistingFiles: "false",
                publishUrl: destElf
            }
        }));
});

gulp.task("Publish-Cobbler-Design-Local", function () {
    var destCobbler = config.cobblerWebsiteRootLocal;
    gulp.src("./Cobbler.Design/Content/**/*").pipe(gulp.dest(destCobbler + "/Content"));
    gulp.src("./Cobbler.Design/fonts/**/*").pipe(gulp.dest(destCobbler + "/fonts"));
    gulp.src("./Cobbler.Design/Scripts/**/*").pipe(gulp.dest(destCobbler + "/Scripts"));
});

gulp.task('Serialize-Cobbler-Items-Local', function (cb) {
    var psScriptFolder = config.psScriptFolderLocal;
    exec('powershell.exe -file ' + psScriptFolder + '/SerializeItems.ps1', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('Deserialize-Cobbler-Items-Local', function (cb) {
    var psScriptFolder = config.psScriptFolderLocal;
    exec('powershell.exe -file ' + psScriptFolder + '/DeserializeItems.ps1', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('DeployAll-Local', function (callback) {
    runSequence(['Publish-Cobbler-Local', 'Publish-Elf-Local'], 'Publish-Cobbler-Design-Local', 'Deserialize-Cobbler-Items-Local', callback);
});

gulp.task('Deploy-Projects-Local', function (callback) {
    runSequence(['Publish-Cobbler-Local', 'Publish-Elf-Local'], 'Publish-Cobbler-Design-Local', callback);
});

gulp.task("Auto-Publish-Css-Local", function () {
    var root = "./cobbler.design";
    return gulp.watch(root + "/**/*.css", function (event) {
        if (event.type === "changed") {
            console.log("publish this file " + event.path);
            gulp.src(event.path, { base: root }).pipe(gulp.dest(config.cobblerWebsiteRootLocal + "/Content"));
        }
        console.log("published " + event.path);
    });
});

gulp.task("Auto-Publish-js-Local", function () {
    var root = "./cobbler.design";
    return gulp.watch(root + "/**/*.js", function (event) {
        if (event.type === "changed") {
            console.log("publish this file " + event.path);
            gulp.src(event.path, { base: root }).pipe(gulp.dest(config.cobblerWebsiteRootLocal + "/Scripts"));
        }
        console.log("published " + event.path);
    });
});

gulp.task("Auto-Publish-Views-Local", function () {
    var root = "./cobbler.web/views";
    return gulp.watch(root + "/**/*.cshtml", function (event) {
        if (event.type === "changed") {
            console.log("publish this file " + event.path);
            gulp.src(event.path, { base: root }).pipe(gulp.dest(config.cobblerWebsiteRootLocal + "/Views"));
        }
        console.log("published " + event.path);
    });
});

//Scripts for QA environment. Will bbe deployed via TeamCity
gulp.task("Publish-Cobbler-QA", function () {
    var destCobbler = config.cobblerWebsiteRootQA;
    console.log("publish to " + destCobbler + " folder");
    gulp.src("**/Cobbler.Web.csproj")
        .pipe(debug({ title: "Building project:" }))
        .pipe(msbuild({
            targets: ["Clean", "Build"],
            configuration: "QA",
            logCommand: false,
            verbosity: "minimal",
            maxcpucount: 0,
            toolsVersion: 12.0,
            properties: {
                DeployOnBuild: "true",
                DeployDefaultTarget: "WebPublish",
                WebPublishMethod: "FileSystem",
                DeleteExistingFiles: "false",
                publishUrl: destCobbler
            }
        }));
});


gulp.task("Publish-Elf-QA", function () {
    var destElf = config.elfWebsiteRootQA;
    console.log("publish to " + destElf + " folder");
    gulp.src("**/Elf.WebApi.csproj")
        .pipe(debug({ title: "Building project:" }))
        .pipe(msbuild({
            targets: ["Clean", "Build"],
            configuration: "QA",
            logCommand: false,
            verbosity: "minimal",
            maxcpucount: 0,
            toolsVersion: 12.0,
            properties: {
                DeployOnBuild: "true",
                DeployDefaultTarget: "WebPublish",
                WebPublishMethod: "FileSystem",
                DeleteExistingFiles: "false",
                publishUrl: destElf
            }
        }));
});

gulp.task("Publish-Cobbler-Design-QA", function () {
    var destCobbler = config.cobblerWebsiteRootQA;
    gulp.src("./Cobbler.Design/Content/**/*").pipe(gulp.dest(destCobbler + "/Content"));
    gulp.src("./Cobbler.Design/fonts/**/*").pipe(gulp.dest(destCobbler + "/fonts"));
    gulp.src("./Cobbler.Design/Scripts/**/*").pipe(gulp.dest(destCobbler + "/Scripts"));
});


gulp.task('Deserialize-Cobbler-Items-QA', function (cb) {
    var psScriptFolder = config.psScriptFolderQA;
    exec('powershell.exe -file ' + psScriptFolder + '/DeserializeItems-qa.ps1', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('DeployAll-QA', function (callback) {
    runSequence(['Publish-Cobbler-QA', 'Publish-Elf-QA'], 'Publish-Cobbler-Design-QA', 'Deserialize-Cobbler-Items-QA', callback);
});

gulp.task('Deploy-Projects-QA', function (callback) {
    runSequence(['Publish-Cobbler-QA', 'Publish-Elf-QA'], 'Publish-Cobbler-Design-QA', callback);
});

