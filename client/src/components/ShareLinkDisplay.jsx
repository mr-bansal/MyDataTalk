import React from 'react';

const ShareLinkDisplay = ({ link }) => {
    if (!link) {
        return null;
    }

    return (
        <div className="share-link-display bg-gray-100 p-4 rounded-md shadow-md">
            <p className="text-gray-700 mb-2">Share this link to view the results:</p>
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                {link}
            </a>
        </div>
    );
};

export default ShareLinkDisplay;