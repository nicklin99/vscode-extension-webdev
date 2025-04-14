const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/extension.ts',
    output: {
        filename: 'extension.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    externals: {
        vscode: 'commonjs vscode'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/**/*.json', to: 'dist', flatten: true }
            ]
        })
    ],
    devtool: 'source-map'
};