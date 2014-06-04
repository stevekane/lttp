module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      dist: {
        files: {
          "assets/dist/lttp.js": "public/main.js"
        },
        options: {
          external: ["lodash"],
          transform: ["es6ify"] 
        }
      }
    },

    watch: {
      templates: {
        files: ["public/**/*.js"],
        tasks: ["browserify"],
        options: {
          livereload: true 
        }
      } 
    }
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.registerTask("default", [
    "browserify", 
    "watch"
  ]);
};
