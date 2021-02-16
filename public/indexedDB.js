let db;
//creating a new db request for our progressive budget database!
const request = indexedDB.open("budget", 1);

// Creating an object store called "pending" that autoIncrements when set to true.
request.onupgradeneeded = (e) => {
	const db = e.target.result;
	db.createObjectStore("transaction", { autoIncrement: true });
};

request.onsuccess = (e) => {
	db = e.target.result;

	//Checks to see if app is online before checking database.
	if (navigator.onLine) {
		checkDatabase();
	}
};

request.onerror = (e) => {
	console.log(`Error ${e.target.errorCode}`);
};

const saveTransaction = (data) => {
	// Create a transaction on the pending db with readwrite access
	const transaction = db.transaction([ "transaction" ], "readwrite");

	// Access your object store
	const store = transaction.objectStore("transaction");

	// Add data to your store with add method.
	store.add(data);
};
