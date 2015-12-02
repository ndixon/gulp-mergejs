"use strict";

var async = require("async");

var fs = require("fs");

var gutil = require("gulp-util");

var path = require("path");

var through = require("through2");

module.exports = function () {

    return through.obj(function (file, enc, cb) {

        if (file.isStream()) {

            this.emit("error", new gutil.PluginError("gulp-mergejs", "Streaming not supported"));

            return cb();

        }

        try {

            // code...

        } catch(err) {

            this.emit("error", new gutil.PluginError("gulp-mergejs", err));

            return cb();

        }

    });

};
