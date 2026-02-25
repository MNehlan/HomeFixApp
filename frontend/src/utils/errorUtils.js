/**
 * Maps Firebase/Backend error codes to user-friendly messages.
 * @param {Error|Object|string} error - The error object or string.
 * @returns {string} - A friendly error message.
 */
export const getFriendlyErrorMessage = (error) => {
    if (!error) return "";

    // If it's just a string, checking for common raw messages
    const message = typeof error === "string" ? error : error.message || error.code || "";

    // Firebase Auth Errors
    if (message.includes("auth/invalid-credential") || message.includes("auth/user-not-found") || message.includes("auth/wrong-password")) {
        return "Invalid email or password. Please try again.";
    }
    if (message.includes("auth/email-already-in-use")) {
        return "This email is already registered. Please login instead.";
    }
    if (message.includes("auth/weak-password")) {
        return "Password should be at least 6 characters.";
    }
    if (message.includes("auth/network-request-failed")) {
        return "Network error. Please check your internet connection.";
    }
    if (message.includes("auth/too-many-requests")) {
        return "Too many failed attempts. Please try again later.";
    }
    if (message.includes("auth/requires-recent-login")) {
        return "Please login again to verify your identity.";
    }

    // Generic Backend/Axios Errors
    if (message.includes("Network Error")) {
        return "Unable to connect to server. Is the backend running?";
    }
    if (message.includes("404")) {
        return "Resource not found.";
    }
    if (message.includes("403") || message.includes("permission-denied")) {
        return "You do not have permission to perform this action.";
    }

    // Fallback
    return message.replace("Firebase: ", "").replace("Error: ", "");
};
