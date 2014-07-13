'use strict';
var util = require('util')
  , path = require('path')
  , yeoman = require('yeoman-generator')
  , yosay = require('yosay')
  , chalk = require('chalk');


var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.hookFor('ng-poly:controller', { args: ['main'] });
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {
  var done = this.async();

  this.log(yosay('Welcome to ngPoly!'));

  this.prompt([{
    name: 'appName',
    message: 'What is your app\'s name?'
  }], function (props) {
    this.appName = props.appName;

    done();
  }.bind(this));
};

Generator.prototype.scaffold = function scaffold() {
  // create a directory with appName, unless user is in a directory named appName
  if (this.appName !== this._.last(this.destinationRoot().split(path.sep))) {
    this.destinationRoot(this.appName);
  }

  var context = { appName: this.appName };

  this.template('_bower.json', 'bower.json', context);
  this.template('_package.json', 'package.json', context);
  this.copy('.editorconfig', '.editorconfig');
  this.copy('gulpfile.js', 'Gulpfile.js');
  this.copy('.jshintrc', '.jshintrc');

  this.mkdir('src/jade/');
  this.template('_index.jade', 'src/jade/index.jade', context);
  this.mkdir('src/jade/views/');
  this.template('_main.jade', 'src/jade/views/main.jade', context);

  this.mkdir('src/js/');
  this.template('_app.js', 'src/js/app.js');

  this.mkdir('src/less/');
  this.copy('style.less', 'src/less/style.less');
  this.mkdir('src/less/includes/');
  this.copy('variables.less', 'src/less/includes/variables.less');

  this.mkdir('tests/');
  
};

Generator.prototype.dependencies = function dependencies() {
  if (!this.options['skip-install']) {
    this.installDependencies();
  }
};