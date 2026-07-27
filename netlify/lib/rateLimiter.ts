interface RequestRecord {
    timestamps: number[];
}

const store = new Map<string, RequestRecord>();


const MAX_REQUESTS = 10; // Maximum number of requests allowed
const WINDOW_MS = 60 * 1000; // (1 minute)

export function rateLimiter(ip: string): boolean {
    const now = Date.now();
    const record = store.get(ip) ?? { timestamps: [] };

    record.timestamps = record.timestamps.filter(timestamp => now - timestamp < WINDOW_MS);

    if (record.timestamps.length >= MAX_REQUESTS) {
        store.set(ip, record);
        return false; // Rate limit exceeded
    }
    record.timestamps.push(now);
    store.set(ip, record);
    return true; // Request allowed
};