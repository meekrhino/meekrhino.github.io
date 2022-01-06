import * as HtmlWebPackPlugin from 'html-webpack-plugin'
import * as path from 'path'

/* HTML Plugin */
const htmlPlugin = new HtmlWebPackPlugin({
    template: './src/launch/index.html'
})

const productionConfig = {
    output: {
        // Tweak this to match your GitHub project name
        publicPath: "/bingo/",
    },
}

/* Exports */
module.exports = {
    mode: 'development',
    entry: './src/launch/index.tsx',
    resolve: {
        /* Add '.ts' and '.tsx' as resolvable extensions. */
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            /**
             * All files with a '.ts' or '.tsx' extension will be
             * handled by 'awesome-typescript-loader'.
             */
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            }
        ],
    },
    output: {
        path: path.resolve(__dirname),
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [htmlPlugin],
    devServer: {
        historyApiFallback: true
    }
}
