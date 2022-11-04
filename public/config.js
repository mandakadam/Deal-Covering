var config = {
    "organisationName": "© Credence Analytics (India) Pvt. Ltd. All Rights Reserved.",
    "product_name": "Login App"
};

config.baseURL = '/';
config.jsonserver = true;
config.JREST = "http://localhost:50001"; //JREST
config.NREST = "/NREST"; //NREST

config.globalDateFormatLong = "MM-DD-YYYY HH24:mi:ss";
config.globalDateFormatShort = "MM-DD-YYYY";
config.globalTimeFormat = "hh:mm:ss";


// Change the getItem functions argument according to your sessionStorages respective Keys
config.getSessionStorage = () => ({ 
    ...sessionStorage,
    userid: sessionStorage.getItem("_userid"),
    user_name: sessionStorage.getItem("_user_name"),
    sessionid: sessionStorage.getItem("_ticket")
});