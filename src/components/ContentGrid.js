import React from "react";
import { useNavigate } from "react-router-dom";

const ContentGrid = ({ title, items, type = "category", bgColor }) => {
    const navigate = useNavigate();

    // Pastel palette for brands if no color provided
    const brandColors = [
        "#E0F7FA", // Light Cyan
        "#FCE4EC", // Light Pink
        "#FBE9E7", // Light Deep Orange
        "#FFF8E1", // Light Amber
        "#F3E5F5", // Light Purple
        "#E8F5E9", // Light Green
    ];

    const handleItemClick = (item) => {
        if (type === 'brand') {
            navigate(`/products?brand=${item.name}`);
        } else {
            // Assume category or sub-category
            // Check if item.path exists (from assets.js categories) or construct from name
            const specialPaths = ['breakfast-essentials', 'noodles-pasta', 'ketchup-dips-spreads', 'chocolate-sweets', 'jams-honey', 'pickles-chutney', 'ready-to-cook', 'baking-essentials', 'masalas-spices', 'household-care', 'detergent', 'snacks', 'tea-coffee'];

            if (item.path && specialPaths.includes(item.path)) {
                navigate(`/${item.path}`);
            } else {
                const path = item.path || item.name; // Fallback
                navigate(`/products/${path}`);
            }
        }
        scrollTo(0, 0);
    };

    return (
        <div className="my-8">
            {title && <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">{title}</h2>}

            <div
                className={`grid gap-4 ${type === "brand"
                    ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
                    : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
                    }`}
            >
                {items.map((item, index) => {
                    // Determine background color
                    let cardBg = bgColor;
                    if (type === "brand") {
                        cardBg = brandColors[index % brandColors.length];
                    } else if (item.bgColor) {
                        cardBg = item.bgColor;
                    }

                    return (
                        <div
                            key={index}
                            onClick={() => handleItemClick(item)}
                            className={`cursor-pointer rounded-xl flex flex-col items-center justify-between p-3 transition-all duration-300 hover:scale-105 active:scale-95 text-center shadow-sm hover:shadow-xl
                ${type === 'brand' ? 'h-32 sm:h-36' : 'h-36 sm:h-40'}
              `}
                            style={{ backgroundColor: cardBg }}
                        >
                            {/* Layout varies by type */}
                            {type === "brand" ? (
                                <>
                                    <p className="text-xs sm:text-sm font-semibold truncate w-full px-1 text-gray-800">
                                        {item.name}
                                    </p>
                                    <div className="flex-1 flex items-center justify-center w-full">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="max-h-20 max-w-full object-contain mix-blend-multiply transition-transform duration-300"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex-1 flex items-center justify-center w-full bg-white/60 backdrop-blur-sm rounded-lg p-2 mb-2 transition-colors duration-300">
                                        <img
                                            src={Array.isArray(item.image) ? item.image[0] : item.image}
                                            alt={item.text || item.name}
                                            className="max-h-20 max-w-full object-contain transition-transform duration-300"
                                        />
                                    </div>
                                    <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-tight px-1">
                                        {item.text || item.name}
                                    </p>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ContentGrid;
