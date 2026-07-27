export interface Chatprovider {
    generateResponse (message: string, context: string): Promise<string>;
}