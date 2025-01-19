import React from 'react';
import ScrollTriggered from './ScrollTriggered';  

function ExtensionWrapper() {
    const isExtension = window.chrome && window.chrome.runtime && window.chrome.runtime.id;

    if (isExtension) {
        return (
            <div style={extensionContainerStyle}>
                <ScrollTriggered />
            </div>
        );
    }

    return <ScrollTriggered />;
}

const extensionContainerStyle = {
    width: '400px',
    height: '600px',
    overflow: 'hidden',
    position: 'relative',
    // This wrapper handles the extension constraints while preserving
    // ScrollTriggered's original styling
    '& > div': {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto'
    }
};

export default ExtensionWrapper;