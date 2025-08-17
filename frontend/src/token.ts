export interface TokenData {
    username: string;
    user_type: 'USER' | 'ADMIN';
}

export const decodeToken = (): TokenData | null => {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = atob(payloadBase64);
        return JSON.parse(decodedPayload) as TokenData;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};
