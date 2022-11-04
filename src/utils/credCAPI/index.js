import config from "config";
const user = config.getSessionStorage();
const boolDP = process.env.NODE_ENV !== 'development'

export const _toString = Object.prototype.toString;
export const isPlainObject = (obj) => _toString.call(obj) === '[object Object]';
export const isRegExp = (v) => _toString.call(v) === '[object RegExp]';

export const isFunction = (fn) => _toString.call(fn) === "[object Function]";
function handleErrors(response) {
	if (!response.ok) {
		if (response.status == 400) {
			return response.json().then(data => {
				console.error(data.data.errors);
				throw new Error(JSON.stringify(data.data.errors));
			});
		} else if (response.status === 401) {
				if(boolDP){
					const sessionid = config.getSessionStorage().sessionid
					if(!sessionid) alert('Session expired. Plese login again');
					window.location.href = "/";
					sessionStorage.clear();
				}
				else{
					// alert('Dev :: Session expired. Plese login again')
					console.log("Running in devlopment mode ...");
				}
		}
		else throw new Error(JSON.stringify(response.statusText));
	}
	return response;
}

const jsonserverCreate = function (requestURL, query) {
	const body = {...(query && query.body.data||{}) };
	return fetch(requestURL, {
		method: "POST",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	})
		.then(handleErrors)
		.then(response => {
			return response.json();
		})
		.then(data => {
			return data;
		})
		.catch(error => console.error(JSON.stringify(error)));
};
const jsonserverRead = function (url, query) {
	const body = {...(query && query.body||{}) };

	const processQuery = function (querydetails) {
		var result = "";
		if (querydetails.id) result += `/${querydetails.id}`;
		if (querydetails.start) {
			if (!querydetails.end) querydetails.end = querydetails.start + 20;
			result += `&_start=${querydetails.start}&_end=${querydetails.end}`;
		}
		// const operatormap = { $lte: "_lte", $gte: "_gte", $eq: "" };
		if (querydetails) {
			result += `&user=${JSON.stringify(user)}`;
			Object.keys(querydetails).forEach(key => {
				var condition = querydetails[key];
				if (typeof condition === "object") {
					result += `&${key}=${encodeURIComponent(JSON.stringify(condition))}`;
				} else {
					result += `&${key}=${querydetails[key]}`;
				}
			});
		}

		return result;
	};
	var requestURL = url;
	if (body) requestURL += "?" + processQuery(body);
	return fetch(requestURL)
		.then(handleErrors)
		.then(response => {
			return response.json();
		})
		.then(data => {
			return data;
		})
		.catch(error => console.error(JSON.stringify(error)));
};
const jsonserverUpdate = function (requestURL, query) {
	// if (query.body.id) requestURL += `/${query.body.id}`;
	const body = {...(query && query.body ? query.body.data : {}) };
	
	return fetch(requestURL, {
		method: "PUT", // *GET, POST, PUT, DELETE, etc.
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body) // body data type must match "Content-Type" header
	})
		.then(handleErrors)
		.then(response => {
			return response.json();
		})
		.then(data => {
			return data;
		})
		.catch(error => console.error(JSON.stringify(error)));
};
const jsonserverDelete = function (requestURL, query) {

	const body = {...(query && query.body ? query.body.data : {}) };

	return fetch(requestURL, {
		method: "DELETE",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	})
		.then(handleErrors)
		.then(response => {
			return response.json();
		})
		.then(data => {
			return data;
		})
		.catch(error => console.error(JSON.stringify(error)));
};

const requestor = defaults => ( requestURL, options = {} ) => {
	if(isPlainObject(options) === false) options = {};
	const onError = options.onError; delete options.onError;
	let contentType = "application/json;";
	// merging defaults and other passed options, and deep merging body and headers.
	/*const _body = (options && options.headers && options.headers['Content-Type'] == 'application/x-www-form-urlencoded') ? {body: new URLSearchParams(options.body)} : { body : JSON.stringify({ ...defaults.body, ...options.body }) }*/

	let _body = options.body;
	let _headers = options.headers;

	requestURL = options.requestURL || requestURL;

	const sessionid = config.getSessionStorage().sessionid

	if(options && options.headers && options.headers.get) {
		options.body = _body
		options.headers = _headers
		options.headers.set("sessionid", sessionid)

	} else {
		options = Object.assign({}, defaults, options, { headers : { ...defaults.headers, ...options.headers } },{ body: JSON.stringify(options.body)});
		options.headers.sessionid = sessionid
	}	

	if((options && options.headers && options.headers['Content-Type'] && options.headers['Content-Type'].includes('application/x-www-form-urlencoded')) ){
		options.body =  new URLSearchParams(_body);
	}
	
	
	return fetch(requestURL, options)
	.then(response => {
		handleErrors(response);
		if(response && response.headers && isFunction(response.headers.get)) 
			contentType = response.headers.get("Content-Type");
		
		if (contentType.includes("application/json;"))
			return response.json();
			
		if (contentType.includes("application/json;") && options.headers.type=='blob')
			return response.json();
		else
			return response.blob();
	})
	.catch(error => {
		console.error(JSON.stringify(error));
		isFunction(onError) && onError(error);
		return {error, status: "unsuccess"};
	});
}

// Defaulting the headers ...
const NREST_POST = requestor({
	method: "POST",
	headers: {
		Accept: "application/json, text/plain, */*",
		"Content-Type": "application/json",
	},
});


export default options => {
	var baseurl = options ? (options.baseurl || "") : "",
		serverType = options.servertype || "jsonserver",
		fetchCreate = null, 
		fetchRead = null, 
		fetchUpdate = null, 
		fetchDelete = null,
		systemEvents = new EventTarget(), 
		user = new Object({ update() { } });

	switch(serverType) {
		case "jsonserver":
			fetchCreate = jsonserverCreate,
			fetchRead = jsonserverRead,
			fetchUpdate = jsonserverUpdate,
			fetchDelete = jsonserverDelete
			break;
		default:
			fetchCreate = fetchRead = fetchUpdate = fetchDelete = NREST_POST;
			break;
	}

	return {
		user: user,
		subscribe(eventname, handler) {
			systemEvents.addEventListener(eventname, handler);
			return eventname;
		},
		publish(eventname) {
			var aevent = new Event(eventname);
			systemEvents.dispatchEvent(aevent);
			return aevent;
		},
		unsubscribe(eventname, handler) {
			systemEvents.removeEventListener(eventname, handler);
			return true;
		},
		async login(details) {
			systemEvents.dispatchEvent(new Event("login", details));
		},
		async logout() {
			this.loggedIn = false;
			sessionStorage.clear();
			systemEvents.dispatchEvent(new Event("logout"));
		},
		loggedIn: config.getSessionStorage().sessionid ? true : false,
		collection(collName) {
			return {
				create(data) {
					return fetchCreate(`${baseurl}/${collName}`, data);
				},
				read(data) {
					return fetchRead(`${baseurl}/${collName}`, data);
				},
				readone(id) {
					return fetchRead(`${baseurl}/${collName}/${id}`);
				},
				update(data) {
					return fetchUpdate(`${baseurl}/${collName}`, data);
				},
				delete(data) {
					return fetchDelete(`${baseurl}/${collName}`, data);
				}
			};
		}
	};
};