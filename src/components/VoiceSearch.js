import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const VoiceSearch = () => {
    const { products, cartItems, setCartItems } = useAppContext();
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.warn("Web Speech API not supported in this browser.");
            return;
        }
    }, []);

    const handleVoiceCommand = () => {
        if (!('webkitSpeechRecognition' in window)) {
            toast.error("Voice search not supported in this browser (Use Chrome).");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            toast.loading("Listening... (Say 'Add Tomato and Potato')", { id: "voice-toast" }); // use ID to update/dismiss
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
            toast.error("Could not hear you. Try again.", { id: "voice-toast" });
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            toast.success(`Heard: "${transcript}"`, { id: "voice-toast" });
            processCommand(transcript);
        };

        recognition.start();
    };

    const processCommand = (transcript) => {
        // Simple keyword matching
        // e.g. "Add tomato onion and potato to cart"

        let foundProducts = [];
        let missingWords = [];

        // Split by common separators
        // Remove "add", "to", "cart", "please" to clean up
        const cleanTranscript = transcript
            .replace(/add/g, "")
            .replace(/to/g, "")
            .replace(/cart/g, "")
            .replace(/please/g, "")
            .replace(/and/g, " ")
            .replace(/,/g, " ");

        const words = cleanTranscript.split(" ").filter(w => w.length > 2); // Ignore short words

        // Match words against product names
        // Optimistic matching: If a word appears in a product name

        let newCartData = structuredClone(cartItems || {});
        let addedCount = 0;

        words.forEach(word => {
            // Find a product that contains this word (case insensitive)
            // Use find to get just one match per word to avoid exploding cart with "Fresh Tomato" vs "Tomato"
            // This is a naive implementation but fits the "cool feature" request
            const product = products.find(p => p.name.toLowerCase().includes(word));

            if (product) {
                // Check if we already added this product in this session to prevent duplicates from same sentence?
                // Actually, if user says "tomato and tomato", maybe they want 2? Let's process sequential.

                const currentQty = newCartData[product._id] || 0;
                newCartData[product._id] = currentQty + 1;
                foundProducts.push(product.name);
                addedCount++;
            }
        });

        if (addedCount > 0) {
            setCartItems(newCartData);
            // Deduplicate names for display
            const uniqueNames = [...new Set(foundProducts)];
            toast.success(`Added ${uniqueNames.join(", ")} to cart!`);
        } else {
            toast("No products found from your command.", { icon: "🤷" });
        }
    };

    return (
        <button
            onClick={handleVoiceCommand}
            className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'hover:bg-gray-100 text-gray-500'}`}
            title="Voice Command"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
        </button>
    );
};

export default VoiceSearch;
