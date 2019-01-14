const path = require("path");

// Require the new plugin
const HtmlWebpackPlugin = require("html-webpack-plugin"); 
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = { 
  entry:{
    "index": "./src/index.tsx",
    "search": "./src/search.tsx",
    "currency" : "./src/currency.tsx",
    // "contact" : "./src/contact.tsx" 
    "contact_page" : "./src/contact_page.tsx",
    "contact_footer" : "./src/contact_footer.tsx"

},
  devtool: "source-map",

  devServer: {
    
    
    proxy : {
      '/api': {
         target: 'http://localhost:8080',
         rewritePath: {'^/api' : ''}
      }
    }
    
},

  resolve: { 
    extensions: [".ts", ".tsx", ".js", ".json"] 
  }, 
  output: { 
    filename: '[name].bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    
  }, 
  module: { 
    rules: [ 
      {  
        test: /\.tsx?$/,  
        loader: "awesome-typescript-loader"  
      }
    ]
   },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject:false 
    }),
    new CopyWebpackPlugin([{
      from: './src/image',
      to: './src/image',
      },
      {
        from:'./src/*.css',
        to: './'
      },
      {
        from:'./src/*.html',
        to: './'
      },
      {
        from:'./src/fonts',
        to: './src/fonts'
      }
    ])
    
  ]
}