import * as simpleIcons from 'simple-icons';

/**
 * Normalizes platform name to icon key
 * Examples:
 * - "GitHub" → "github"
 * - "Node.js" → "nodedotjs"
 * - "C++" → "cplusplus"
 * - "Twitter" → "x"
 */
export function normalizePlatformName(name) {
    if (!name) return '';

    let normalized = name.toLowerCase().trim();

    // Handle special cases
    const specialCases = {
        'twitter': 'x', // Specific for social
        'x': 'x',
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
 * Resolves icon object from platform name
 * Returns the icon object with svg, path, hex, etc. or null if not found
 */
export function resolveSocialIcon(platformName) {
    if (!platformName) return null;

    const normalized = normalizePlatformName(platformName);

    // Try to get icon from simple-icons
    // simple-icons exports icons with 'si' prefix in camelCase
    const iconKey = `si${normalized.charAt(0).toUpperCase() + normalized.slice(1)}`;

    // Find the icon key that starts with the constructed key (case-insensitive check handled by construction)
    // Actually simple-icons keys are strictly CamelCase starting with 'si'. 
    // Example: siGithub, siLinkedin, siX.

    // We need to match precise keys.
    const icon = simpleIcons[Object.keys(simpleIcons).find(key => key.startsWith(iconKey))];
    if (!icon) return null;

    return icon;
}
