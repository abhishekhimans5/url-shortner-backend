import {UAParser} from "ua-parser-js"

export const parseUserAgentInfo = (userAgent) => {
    const parser = new UAParser();
    parser.setUA(userAgent);
    const result = parser.getResult();
    return {
        browser: result.browser.name,
        version: result.browser.version,
        os: result.os.name,
        osVersion: result.os.version,
        device: result.device.model || 'Desktop',
    };
}