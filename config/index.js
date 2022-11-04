import { CONFIG_FILE_URL } from "./applicationDetails";

const configLoader = function (callback) {
    if (configLoader.cache) return Promise.resolve(callback(configLoader.cache));

    if (configLoader.counter == null) configLoader.counter = 1;
    else configLoader.counter++;

    console.log(
        `Loading config file from ${CONFIG_FILE_URL}`,
        "\nconfigLoader.counter -::- ", configLoader.counter
    );

    return fetch(CONFIG_FILE_URL)
        .then(response => response.text().then(text => {
            return new Function(text + ";\n return config")()
        }))
        .then(response => {
            configLoader.cache = response;
            return callback(response);
        })
        .catch(error => {
            console.log(`Error occured while loading config file from ${CONFIG_FILE_URL}`, error);
            delete configLoader.cache;
            return callback({})
        })
};

export default configLoader;