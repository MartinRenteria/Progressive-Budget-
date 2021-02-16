let db;
//creating a new db request for our progressive budget database!
const request = indexedDB.open("budget", 1);

// Creating an object store called "transaction" that autoIncrements when set to true.
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
	// Create a transaction on the "transaction" db with readwrite access
	const transaction = db.transaction([ "transaction" ], "readwrite");

	// Access your object store
	const store = transaction.objectStore("transaction");

	// Add data to your store with add method.
	store.add(data);
};

function checkDatabase() {
    // Open a transaction on your store db
    const transaction = db.transaction(["transaction"], "readwrite");
    // Access your pending object store
    const store = transaction.objectStore("transaction");
    // Get all records from store and set to a variable
    const getAll = store.getAll();
  
    getAll.onsuccess =  async () => {
        try {
            if (getAll.result.length > 0) {
                const response = await fetch("/api/transaction/bulk", {
                  method: "POST",
                  body: JSON.stringify(getAll.result),
                  headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                  }
                })
                response.json()
                
                const transaction = db.transaction(["transaction"], "readwrite");
        
                // Access your transaction object store
                 const store = transaction.objectStore("transaction");
          
                // Clear all items in your store
                store.clear();
              }
        } catch (error) {
            console.log(`Error ${error}`);
        }
      
    };
  }
  
  // Listen for the app to come back online.
  window.addEventListener("online", checkDatabase);
