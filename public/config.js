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

config.currencyPair = [
    { "code": "USD/INR", "descr": "USD/INR"},
    { "code": "EUR/USD", "descr": "EUR/USD"},
    { "code": "USD/JPY", "descr": "USD/JPY"},
    { "code": "GBP/USD", "descr": "GBP/USD"},
    { "code": "AUD/USD", "descr": "AUD/USD"},
    { "code": "USD/CAD", "descr": "USD/CAD"},
    { "code": "USD/CNY", "descr": "USD/CNY"},
    { "code": "USD/CHF", "descr": "USD/CHF"},
    { "code": "USD/HKD", "descr": "USD/HKD"},
]


// Change the getItem functions argument according to your sessionStorages respective Keys
config.getSessionStorage = () => ({ 
    ...sessionStorage,
    userid: sessionStorage.getItem("_userid"),
    user_name: sessionStorage.getItem("_user_name"),
    sessionid: sessionStorage.getItem("_ticket")
});