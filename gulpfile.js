const rollup = require('rollup');
const rollupPluginStripPragma = require('rollup-plugin-strip-pragma');
const babel = require('rollup-plugin-babel');
const rollupPluginUglify = require('rollup-plugin-uglify');
const uglify = require('rollup-plugin-uglify-es');
const gulp = require('gulp');
const os = require('os');
const path = require('path');
const rimraf = require('rimraf');

function rollupWarning(message) {
  // Ignore eval warnings in third-party code we don't have control over
  if (message.code === 'EVAL' && /(protobuf-minimal|crunch)\.js$/.test(message.loc.file)) {
    return;
  }
  console.log(message);
}

function combineJS(debug, optimizer, filename) {
  const plugins = [babel()];

  if (!debug) {
    plugins.push(rollupPluginStripPragma({
      pragmas: ['debug'],
    }));
  }
  if (optimizer === 'uglify2-es') {
    plugins.push(uglify());
  }
  if (optimizer === 'uglify2') {
    plugins.push(rollupPluginUglify.uglify());
  }
  let format = 'umd';
  if (/.*es$/.test(optimizer)) {
    format = 'esm';
  }

  const ext = /.*es$/.test(optimizer) ? '.esm.js' : '.umd.js';
  return rollup.rollup({
    input: 'source/ArrowGraphic.js',
    plugins,
    onwarn: rollupWarning,
  }).then((bundle) => bundle.write({
    format,
    name: 'ArrowGraphic',
    file: path.join('./', `${filename}${ext}`),
    sourcemap: debug
  }));
}

function build() {
  rimraf.sync("./build");
  combineJS(true, 'none', path.join('build', 'ArrowGraphic'));
  combineJS(false, 'uglify2', path.join('build', 'ArrowGraphic.min'));
  combineJS(true, 'none-es', path.join('build', 'ArrowGraphic'));
  return combineJS(false, 'uglify2-es', path.join('build', 'ArrowGraphic.min'));
  // combineJavaScript({
  //   removePragmas: true,
  //   optimizer: 'uglify2-es',
  //   outputDirectory: path.join('build', 'CesiumPro'),
  // });
  // combineJavaScript({
  //   removePragmas: false,
  //   optimizer: 'none-es',
  //   outputDirectory: path.join('build', 'CesiumProUnminified'),
  // });
  // return combineJavaScript({
  //   removePragmas: false,
  //   optimizer: 'none',
  //   outputDirectory: path.join('build', 'CesiumProUnminified'),
  // });
}
gulp.task('build', build);
