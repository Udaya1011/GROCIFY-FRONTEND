import React from 'react';

const SectionHeader = ({ title }) => {
    return (
        <h2 className="text-xl md:text-2xl font-bold mb-4 mt-8 text-gray-800">
            {title}
        </h2>
    );
};

export default SectionHeader;
