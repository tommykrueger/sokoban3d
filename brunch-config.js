module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'js/vendor.js': /^(vendor)/,
        'js/app.js': /^app/,
      },
      order: {
        before: [
          'vendor/js/three.js',
          'vendor/js/THREE.OrbitControls.js',
          'vendor/js/Stats.min.js',
          'vendor/js/jquery.js',
          'vendor/js/underscore-min.js'
        ]
      }
    },
    stylesheets: {
      //joinTo: 'css/app.css',
      joinTo: {
        'css/app.css': /^app\/stylus\/app.styl/,
        'css/sokoban.css': /^app\/stylus\/sokoban.styl/
      },
      order: {
        before: ['css/normalize.css']
      }
    }
  },

  plugins: {
    babel: {
      presets: ['es2015', 'es2016']
    },
    stylus: {
      includeCss: true
    },
    cleancss: {
      keepSpecialComments: 0,
      removeEmpty: true
    },
    postcss: {
      processors: [
        require('autoprefixer')(['last 8 versions']),
        require('csswring')
      ]
    }
  },

  npm: {
    globals: {
      THREE: 'three',
      jquery: 'jquery',
      underscore: 'underscore'
    }
  }

};
