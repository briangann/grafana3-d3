'use strict';
var GulpConfig = (function () {
    function gulpConfig() {
        this.source = './src/';
        this.sourceApp = this.source;

        this.tsOutputPath = './output';
        this.allJavaScript = [this.source + '/output/**/*.js'];
        this.allTypeScript = 'src/d3-histogram-panel/*.ts';

        this.typings = './typings/';
        this.libraryTypeScriptDefinitions = './typings/index.d.ts';
        //this.libraryTypeScriptDefinitions = './typings/index.d.ts';
        //this.libraryTypeScriptDefinitions = './typings/**/*.ts';
    }
    return gulpConfig;
})();
module.exports = GulpConfig;
