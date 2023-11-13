import XXH from "xxhashjs";
import {randomBytes} from "crypto";

export function timeSinceTimestamp(previousTimestamp: number): string {
    const timeDifference = (Date.now() - previousTimestamp) / 1000; // Convert to seconds
    if (timeDifference < 10) {
        return 'just now';
    } else if (timeDifference < 60) {
        const seconds = Math.floor(timeDifference);
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }

    const intervals = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
        const count = Math.floor(timeDifference / seconds);
        if (count > 0) {
            return count > 1 ? `${count} ${unit}s ago` : `a ${unit} ago`;
        }
    }

    return 'a long time ago';
}

export const hash = (code: string): string => {
    return XXH.h32(code + "#watowai", 555).toString(16);
}

export function generateRandomCode(): string {
    const randomBytesBuffer = randomBytes(2);
    const code = randomBytesBuffer.readUInt16BE(0);
    return String(code % 10000).padStart(4, '0');
}
