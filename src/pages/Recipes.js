import React, { useEffect, useState, useContext } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Recipes = () => {
    const { axios, products, addToCart } = useAppContext();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Recipes
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const { data } = await axios.get('/api/recipe/list');
                if (data.success) {
                    setRecipes(data.recipes);
                } else {
                    toast.error("Failed to load recipes");
                }
            } catch (error) {
                console.error(error);
                toast.error("Error loading recipes");
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, [axios]);

    // Handle "Cook This"
    const handleCookThis = (recipe) => {
        let addedCount = 0;
        let missingItems = [];

        recipe.ingredients.forEach(ingredient => {
            // Logic: Find product where name includes ingredient name (case insensitive)
            // This is a "loose match". 
            // For better results, we might look for exact match or use tags in future.
            const match = products.find(p =>
                p.name.toLowerCase().includes(ingredient.productName.toLowerCase()) && p.inStock
            );

            if (match) {
                addToCart(match._id);
                addedCount++;
            } else {
                missingItems.push(ingredient.productName);
            }
        });

        if (addedCount > 0) {
            toast.success(`Added ${addedCount} ingredients for ${recipe.name} to cart!`);
        }

        if (missingItems.length > 0) {
            setTimeout(() => {
                toast((t) => (
                    <span>
                        <b>Missing ingredients:</b> {missingItems.join(', ')}
                    </span>
                ), { duration: 4000, icon: '⚠️' });
            }, 500);
        }

        if (addedCount === 0 && missingItems.length === recipe.ingredients.length) {
            toast.error("No ingredients found in stock for this recipe.");
        }
    };

    if (loading) return <div className="text-center py-20">Loading recipes...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Chef's Corner 👨‍🍳
                </h1>
                <p className="mt-4 text-xl text-gray-500">
                    Pick a meal, we'll pack the cart.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
                {recipes.map((recipe) => (
                    <div key={recipe._id} className="group relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                        <div className="aspect-w-16 aspect-h-9 w-full bg-gray-200 h-48 flex items-center justify-center">
                            {recipe.image ? (
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL || (window.location.hostname.includes('onrender.com') ? 'https://grocify-backend-1.onrender.com' : 'http://localhost:5000')}/images/${recipe.image}`}
                                    alt={recipe.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                            ) : null}
                            <span className="text-4xl" style={{ display: recipe.image ? 'none' : 'block' }}>🥘</span>
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {recipe.name}
                                    </h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {recipe.cookingTime}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 h-10 overflow-hidden text-ellipsis line-clamp-2">
                                    {recipe.description}
                                </p>

                                <div className="mb-4">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ingredients:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {recipe.ingredients.slice(0, 5).map((ing, idx) => (
                                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                {ing.productName}
                                            </span>
                                        ))}
                                        {recipe.ingredients.length > 5 && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                +{recipe.ingredients.length - 5}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleCookThis(recipe)}
                                className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Cook This 🔥
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {recipes.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    No recipes found. Be the first to cook!
                    {/* Hidden utility to seed if empty */}
                    <button
                        onClick={async () => {
                            await axios.post('/api/recipe/seed');
                            window.location.reload();
                        }}
                        className="block mx-auto mt-4 text-xs text-indigo-400 hover:underline"
                    >
                        (Dev) Seed Recipes
                    </button>
                </div>
            )}
        </div>
    );
};

export default Recipes;
