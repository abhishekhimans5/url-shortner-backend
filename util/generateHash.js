import crypto from 'crypto';

export const generateHash = (length = 7) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const randomBytes = crypto.randomBytes(length);
    let hash = '';
    for (let i = 0; i < length; i++) {
        hash += characters.charAt(randomBytes[i] % characters.length);
    }
    console.log("Generated hash:", hash);
    return hash;
}
