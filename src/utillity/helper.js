export const convertInputToSeconds = (timeString) => {
    const SECONDS_PER_CUSTOM_DAY = 32400; // 9 hours
    const SECONDS_PER_HOUR = 3600;
    const SECONDS_PER_MINUTE = 60;
    
    let totalSeconds = 0;
    
    // Regex to find all segments: (Number) (Unit: d, h, or m)
    const regex = /(\d+)\s*(d|h|m)/gi; 
    let match;

    while ((match = regex.exec(timeString)) !== null) {
        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();

        if (isNaN(value) || value <= 0) continue;

        if (unit === 'd') {
            totalSeconds += value * SECONDS_PER_CUSTOM_DAY;
        } else if (unit === 'h') {
            totalSeconds += value * SECONDS_PER_HOUR;
        } else if (unit === 'm') {
            totalSeconds += value * SECONDS_PER_MINUTE;
        }
    }

    return totalSeconds;
};

/**
 * Converts total minutes into a formatted string (Hh Mm).
 * @param {number} totalMinutes - The total duration in minutes.
 * @returns {string} - Formatted string, e.g., "7h 25m" or "45m".
 */
export const formatMinutesToCustomDays = (totalMinutes) => {
    // Ensure input is a non-negative number
    if (typeof totalMinutes !== 'number' || totalMinutes < 0) {
        return "0m";
    }

    const MINUTES_PER_CUSTOM_DAY = 9 * 60; // 540 minutes

    let formattedTime = '';

    // 1. Calculate Custom Days
    const days = Math.floor(totalMinutes / MINUTES_PER_CUSTOM_DAY);
    let remainingMinutes = totalMinutes % MINUTES_PER_CUSTOM_DAY;

    // 2. Calculate Remaining Hours
    const hours = Math.floor(remainingMinutes / 60);

    // 3. Calculate Remaining Minutes
    const minutes = remainingMinutes % 60;
    
    // --- Build the output string ---

    // Add days if they exist
    if (days > 0) {
        formattedTime += `${days}d `;
    }

    // Add hours if they exist
    if (hours > 0) {
        formattedTime += `${hours}h `;
    }

    // Add minutes: Always show '0m' if total time is zero, 
    // or show minutes if minutes > 0, 
    // or if the total is less than an hour (e.g., 45m when days and hours are 0)
    if (minutes > 0 || totalMinutes === 0 || (days === 0 && hours === 0)) {
        formattedTime += `${minutes}m`;
    }
    
    // Trim any trailing space
    return formattedTime.trim();
};

// --- Examples 
// console.log(formatMinutesToHhMm(446));   // Output: "7h 26m"
// console.log(formatMinutesToHhMm(60));    // Output: "1h"
// console.log(formatMinutesToHhMm(45));    // Output: "45m"
// console.log(formatMinutesToHhMm(0));     // Output: "0m"