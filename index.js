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

            var property = "gulp-mergejs-" + opts.property;

            this[property] = {};

            var oldMerge = this.merge;

            this.merge = function (context, key, items) {

                _.extend(context[property], items);

            };

            eval(String(file.contents));

            this.merge = oldMerge;

            file.contents = new Buffer([

                "this.merge(this, \"%property\", %items);".replace("%property", opts.property)

                                                          .replace("%items", stringify(this[property], { space: 4 })),

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
