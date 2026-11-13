interface RequestRecord {
    timestamps: number[];
}

const store = new Map<string, RequestRecord>();


const MAX_REQUESTS = 10; // Maximum number of requests allowed
const WINDOW_MS = 60 * 1000; // (1 minute)

export function rateLimiter(
    key: string,
    maxRequests = MAX_REQUESTS,
    windowMs = WINDOW_MS,
): boolean {
    const now = Date.now();
    const record = store.get(key) ?? { timestamps: [] };

    record.timestamps = record.timestamps.filter(timestamp => now - timestamp < windowMs);

    if (record.timestamps.length >= maxRequests) {
        store.set(key, record);
        return false; // Rate limit exceeded
    }
    record.timestamps.push(now);
    store.set(key, record);
    return true; // Request allowed
};
