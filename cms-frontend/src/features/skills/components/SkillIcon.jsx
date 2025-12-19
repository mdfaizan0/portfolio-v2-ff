import React from 'react';
import { resolveSkillIcon } from '../utils/iconResolver';

export default function SkillIcon({ skillName, className = "w-6 h-6", useBrandColor = false }) {
    if (!skillName) return null;

    const iconObj = resolveSkillIcon(skillName);

    if (!iconObj) {
        // Fail silently for skills without icons
        return null;
    }

    return (
        <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            fill={useBrandColor ? `#${iconObj.hex}` : "currentColor"}
        >
            <title>{iconObj.title}</title>
            <path d={iconObj.path} />
        </svg>
    );
}
