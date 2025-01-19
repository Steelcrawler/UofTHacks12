const fs = require('fs');
const path = require('path');

async function prepareExtension() {
    const buildDir = path.join(__dirname, '../build');
    const extensionDir = path.join(buildDir, 'extension');

    console.log('Starting extension preparation...');

    // Create extension directory if needed
    if (!fs.existsSync(extensionDir)) {
        fs.mkdirSync(extensionDir, { recursive: true });
    }

    // First, let's copy all static files
    console.log('Copying static files...');
    fs.cpSync(path.join(buildDir, 'static'), path.join(extensionDir, 'static'), { recursive: true });

    // Find the actual main JS file name
    const jsDir = path.join(extensionDir, 'static/js');
    const mainJsFile = fs.readdirSync(jsDir)
        .find(file => file.startsWith('main.') && file.endsWith('.js') && !file.endsWith('.map'));

    if (!mainJsFile) {
        throw new Error('Could not find main JS file');
    }

    // Find the actual CSS file name
    const cssDir = path.join(extensionDir, 'static/css');
    const mainCssFile = fs.readdirSync(cssDir)
        .find(file => file.startsWith('main.') && file.endsWith('.css') && !file.endsWith('.map'));

    console.log('Found main JS file:', mainJsFile);
    console.log('Found main CSS file:', mainCssFile);

    // Create popup.html with correct file paths
    const popupContent = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>The Other Side</title>
        <style>
            body {
                width: 400px;
                height: 600px;
                margin: 0;
                padding: 0;
                overflow: hidden;
                background-color: #f0f0f0;
            }
            #root {
                height: 100%;
                width: 100%;
            }
        </style>
        <link rel="stylesheet" href="static/css/${mainCssFile}">
    </head>
    <body>
        <div id="root">Loading...</div>
        <script src="static/js/${mainJsFile}"></script>
        <script>
            // Add error handling
            window.onerror = function(msg, url, lineNo, columnNo, error) {
                console.error('Error:', msg, url, lineNo, columnNo, error);
                document.getElementById('root').innerHTML = 
                    '<div style="color: red; padding: 20px;">' +
                    '<h3>Error Loading Application:</h3>' +
                    '<p>' + msg + '</p>' +
                    '</div>';
                return false;
            };
        </script>
    </body>
    </html>`;

    fs.writeFileSync(path.join(extensionDir, 'popup.html'), popupContent);
    console.log('Created popup.html with correct file paths');

    // Copy manifest
    fs.copyFileSync(
        path.join(__dirname, '../extension/manifest.json'),
        path.join(extensionDir, 'manifest.json')
    );
    
    console.log('Extension preparation completed successfully!');
}

prepareExtension().catch(error => {
    console.error('Error preparing extension:', error);
    process.exit(1);
});