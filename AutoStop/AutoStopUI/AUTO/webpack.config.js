const path = require("path") 

// Require the new plugin
const HtmlWebpackPlugin = require("html-webpack-plugin") 

module.exports = { 
  entry:{
    "index": "./src/index.tsx",
    "search": "./src/search.tsx",
    "currency" : "./src/currency.tsx" 

},
  devtool: "source-map",
  resolve: { 
    extensions: [".ts", ".tsx", ".js", ".json", ".css"] 
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
      },
      // {
      //   test:/\.css$/,
      //           use:['style-loader','css-loader']
      // }
    ]
   },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject:false 
    })
    
  ]
}