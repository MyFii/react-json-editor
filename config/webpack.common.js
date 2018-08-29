'use strict';


module.exports.basics = {
    entry: [
        './demos/index'
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.md', '.css'],
    },
};

module.exports.rules = [
    {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.md$/,
        use: [
            {
                loader: "html-loader"
            },
            {
                loader: "markdown-loader",
                options: {
                    /* your options here */
                }
            }
        ]
    }
];
