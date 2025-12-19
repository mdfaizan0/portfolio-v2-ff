import * as simpleIcons from 'simple-icons';

/**
 * Normalizes skill name to icon key
 * Examples:
 * - "React" → "react"
 * - "Node.js" → "nodedotjs"
 * - "C++" → "cplusplus"
 * - "C#" → "csharp"
 */
export function normalizeSkillName(name) {
    if (!name) return '';

    let normalized = name.toLowerCase().trim();

    // Handle special cases
    const specialCases = {
        'node.js': 'nodedotjs',
        'nodejs': 'nodedotjs',
        'c++': 'cplusplus',
        'c#': 'csharp',
        'vue.js': 'vuedotjs',
        'next.js': 'nextdotjs',
        'express.js': 'express',
    };

    if (specialCases[normalized]) {
        return specialCases[normalized];
    }

    // Remove spaces, dots, and special characters
    normalized = normalized
        .replace(/\s+/g, '')
        .replace(/\./g, 'dot')
        .replace(/[^a-z0-9]/g, '');

    return normalized;
}

/**
 * Calculate relative luminance of a color
 * Returns value between 0 (darkest) and 1 (lightest)
 */
function getRelativeLuminance(hex) {
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Apply gamma correction
    const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    // Calculate relative luminance
    return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
}

/**
 * Get theme-aware color for icon
 * If the original color is too dark (like black), return a theme-appropriate color
 */
export function getThemeAwareIconColor(hex) {
    const luminance = getRelativeLuminance(hex);

    // If color is very dark (luminance < 0.15), use theme colors
    if (luminance < 0.15) {
        // Check if we're in dark mode
        const isDarkMode = document.documentElement.classList.contains('dark');

        if (isDarkMode) {
            // In dark mode, use a light color for dark icons
            return 'f5f5f4'; // --foreground in dark mode
        } else {
            // In light mode, use a dark color for dark icons
            return '1a1a1a'; // --foreground in light mode
        }
    }

    // Color is bright enough, use original
    return hex;
}

/**
 * Resolves icon object from skill name
 * Returns the icon object with svg, path, hex, etc. or null if not found
 */
export function resolveSkillIcon(skillName) {
    if (!skillName) return null;

    const normalized = normalizeSkillName(skillName);

    // Try to get icon from simple-icons
    // simple-icons exports icons with 'si' prefix in camelCase
    const iconKey = `si${normalized.charAt(0).toUpperCase() + normalized.slice(1)}`;

    const icon = simpleIcons[Object.keys(simpleIcons).find(key => key.startsWith(iconKey))];

    if (!icon) return null;

    // Return icon with theme-aware color
    return icon;
}
