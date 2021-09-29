let HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path')
module.exports = {
    entry: './src/index.js',
    devServer: {
        port: 8082
    }, 
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'index.js',
    },
    module: {
        rules: [{
            test: /\.s(c|a)ss$/,
            use: [
                'vue-style-loader',
                'css-loader',   
                {
                    loader: 'sass-loader',
                    // Requires sass-loader@^8.0.0
                    options: {
                        implementation: require('sass'),
                        sassOptions: {
                            indentedSyntax: true // optional
                        },
                    },
                },
            ],
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader'
        },
        // ... other rules
        {
            test: /\.css$/,
            use: [
                'vue-style-loader',
                'style-loader',
                'css-loader'
            ]
        }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new VueLoaderPlugin()
    ]
};