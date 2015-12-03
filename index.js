"use strict";

var _ = require("underscore");

var gutil = require("gulp-util");

var stringify = require("json-stable-stringify");

var through = require("through2");

module.exports = function (opts) {

    return through.obj(function (file, enc, cb) {

        if (file.isStream()) {

            this.emit("error", new gutil.PluginError("gulp-mergejs", "Streaming not supported"));

            return cb();

        }

        try {

            var ITEMS = {};

            var script = [

                "var window = {};",

                "%fn = function (items) {".replace("%fn", opts.fn),

                "    _.extend(ITEMS, items);",

                "};",

                String(file.contents)

            ].join("\n");

            eval(script);

            file.contents = new Buffer([

                "%fn(%items);".replace("%fn", opts.fn)

                              .replace("%items", stringify(ITEMS, { space: 4 })),

                ""

            ].join("\n"));

            this.push(file);

            cb();

        } catch(err) {

            this.emit("error", new gutil.PluginError("gulp-mergejs", err));

            return cb();

        }

    });

};
