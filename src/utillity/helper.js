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

/**
 * Converts a date string, Date object, or timestamp into a readable format.
 * * @param {Date | string | number} dateInput - The date value to format.
 * @param {string} locale - The locale to use for formatting (e.g., 'en-US', 'en-GB').
 * @returns {string} The formatted date string.
 */
export function formatCreatedAtDate(dateInput, locale = 'en-US') {
    // 1. Ensure the input is a valid Date object
    const date = new Date(dateInput);

    // 2. Check for invalid date
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    // 3. Define formatting options
    const options = {
        year: 'numeric',
        month: 'short', // e.g., 'Oct'
        day: 'numeric', // e.g., '11'
        hour: 'numeric',
        minute: '2-digit', // e.g., '05'
        hour12: true, // Use AM/PM format
    };

    // 4. Use Intl.DateTimeFormat for robust, localized formatting
    // The format will be something like "Oct 11, 2025, 3:49 PM"
    const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);
    
    // Optional: Clean up the output to match "Date at Time" format
    // e.g., changes "Oct 11, 2025, 3:49 PM" to "Oct 11, 2025 at 3:49 PM"
    return formattedDate.replace(',', ' at'); 
}

// --- Example Usage ---

// 1. Using an ISO string (like the one from your database)
// const dbDateString = "2025-10-11T06:30:54.595Z";
// console.log("DB String:", formatCreatedAtDate(dbDateString));
// Output: DB String: 10/11/2025 at 12:00 PM (Note: Time depends on user's timezone)

// 2. Using the desired format
// const customFormatted = formatCreatedAtDate(dbDateString, 'en-US');
// console.log("Custom Format:", customFormatted);
// Output: Custom Format: Oct 11, 2025 at 12:00 PM 

// 3. Example with a different locale (if needed)
// const frenchFormat = formatCreatedAtDate(dbDateString, 'fr-FR');
// console.log("French Format:", frenchFormat);
// Output: French Format: 11 oct. 2025 à 08:30

/**
 * Transforms the dailyAggregates object into a structured array for charting.
 * It also reorders the days to start from Monday (ISO standard).
 *
 * @param {Object} dailyAggregates - The object containing day names and time totals.
 * @returns {Array<Object>} An array of daily log objects with day and hours properties.
 */
export function transformWeeklyAggregates(dailyAggregates) {
    // ⚠️ FIX: Check if dailyAggregates is undefined, null, or not an object
    console.log(dailyAggregates,"from helper")
    if (!dailyAggregates || typeof dailyAggregates !== 'object') {
        // Return an empty array to prevent crashing and signal no data
        return []; 
    }
    
    // Define the desired order of days
    const orderedDays = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday",
    ];

    return orderedDays.map(dayName => {
        // The inner check is still good, but the outer check prevents the crash
        const data = dailyAggregates[dayName] || { totalHours: "0.00", totalMinutes: 0 };
        
        return {
            day: dayName.substring(0, 3), 
            hours: parseFloat(data.totalHours)
        };
    });
}