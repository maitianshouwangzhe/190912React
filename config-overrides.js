const { override, fixBabelImports, addLessLoader } = require('customize-cra');
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    // 使用less-load对源码中的less的变量进行修改， 改了less文件
    addLessLoader({
            javascriptEnabled: true,
            modifyVars: { '@primary-color': '#1890ff' },
    }),
);