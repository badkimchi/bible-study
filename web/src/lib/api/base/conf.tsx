import User from "../../models/User.tsx";

export const devMode = window.location.host.includes('localhost');
let devhost = 'http://localhost:3000';
const prodAPIHost = window.location.origin;
export const url = devMode ? devhost : prodAPIHost;
export const APIConfig = {
    timeout: 5000,
    baseURL: url + "/api/",
    contentType: "application/json",
    headers: {
        "Authorization": "Bearer " + User.getAuthToken(),
        "Accept": "application/json",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "Content-Type": "application/json;charset=UTF-8",
    },
};
