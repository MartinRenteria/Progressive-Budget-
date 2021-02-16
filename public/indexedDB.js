let db;
//creating a new db request for our progressive budget database!
const request = indexedDB.open("budget", 1);

// Creating an object store called "pending" that autoIncrements when set to true.
request.onupgradeneeded = (e) => {
	const db = e.target.result;
	db.createObjectStore("transaction", { autoIncrement: true });
};

