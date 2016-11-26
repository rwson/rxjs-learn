"use strict";

const webpack = require("webpack");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: "babel-loader",
            query: {
                presets: ["es2015", "react"]
            }
        }, {
            test: /\.css$/,
            loaders: [
                "style-loader",
                "css-loader?importLoaders=1",
                "postcss-loader"
            ]
        }]
    },
    stats: {
        colors: true
    },
    devtool: "source-map"
};
