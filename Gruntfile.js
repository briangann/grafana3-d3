module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-package-modules');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-multi-dest');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-typings');
  grunt.loadNpmTasks('grunt-force-task');
  grunt.loadNpmTasks('grunt-ts');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    clean: ["dist"],

    typings: {
      install: {
        options: {
          cwd: 'src'
        }
      }
    },
    copy: {
      main: {
        cwd: 'src',
        expand: true,
        src: ['**/*', '!**/*.js', '!**/*.ts', '!**/*.scss'],
        dest: 'dist'
      },
      externals: {
        cwd: 'src',
        expand: true,
        src: ['**/bower_components/**','**/external/*'],
        dest: 'dist'
      },
      pluginDef: {
        expand: true,
        src: ['README.md'],
        dest: 'dist',
      }
    },

    multidest: {
        copy_some_files: {
            tasks: [
                "copy:main",
                "copy:externals"
            ],
            dest: ["dist"]
        },
    },

    packageModules: {
        dist: {
          src: 'package.json',
          dest: 'dist/src'
        },
    },

    concat: {
      dist: {
        src: ['src/node_modules/**/*.js'],
        dest: 'dist/src/<%= pkg.namelower %>-<%= pkg.version %>.js'
      }
    },

    watch: {
      rebuild_all: {
        files: ['src/**/*', 'README.md', '!src/node_modules/**', '!src/bower_components/**'],
        tasks: ['default'],
        options: {spawn: false}
      },
    },

    tslint: {
      options: {
        // Task-specific options go here.
        configuration: "src/tslint.json"
      },
      files: {
          // Target-specific file lists and/or options go here.
          src: ['src/**/*.ts'],
      },
    },

    ts: {
      default: {
        tsconfig: {
          tsconfig: 'src/tsconfig.json',
          overwriteFilesGlob: false
        },
        dest: 'dist',
        options: {
          fast: 'never',
          verbose: true,
          module: 'commonjs',
          target: 'es2015',
          moduleResolution: 'node',
          sourceMap: true,
          declaration: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          removeComments: false,
          noImplicitUseStrict: true,
          noImplicitAny: false,
          noImplicitThis: false,
          references: [
            'src/typings/index.d.ts',
            'node_modules/grafana-sdk-test/headers/common.d.ts'
          ]
        }
      }
    },

    typescript: {
      base: {
        src: [
          '!src/typings',
          'src/**/*.ts',
          '!node_modules'
        ],
        dest: 'dist',
        options: {
          module: 'commonjs',
          failOnTypeErrors: false,
          target: 'es2015',
          sourceMap: true,
          declaration: true,
          diagnostics: true,
          moduleResolution: 'node',
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          removeComments: false,
          noImplicitUseStrict: true,
          noImplicitAny: false,
          noImplicitThis: false,
          references: [
            'src/typings/index.d.ts'
            //'src/typings/**/*.d.ts'
            //'node_modules/grafana-sdk-test/headers/common.d.ts'
          ]
        }
      }
    },

    babel: {
      options: {
        ignore: ['**/bower_components/*','**/external/*'],
        sourceMap: true,
        presets:  ["es2015"],
        plugins: ['transform-es2015-modules-systemjs', "transform-es2015-for-of"],
      },
      dist: {
        files: [{
          cwd: 'src',
          expand: true,
          src: ['**/*.js'],
          dest: 'dist',
          ext:'.js'
        }]
      },
    },

  });


          //'force:typescript',
          //'ts:default',
  grunt.registerTask('default', [
          'clean',
          'force:typescript',
          'multidest',
          'babel']);
  grunt.registerTask('ugh', ['clean', 'multidest', 'packageModules', 'babel']);
};
