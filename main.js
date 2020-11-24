// Function to hide the loader 
function hideloader() { 
	document.getElementById('loading').style.display = 'none'; 
} 
// Function to define innerHTML for HTML table 
function show(data) {  
	// Setting innerHTML as tab variable 
	document.getElementById("employees").innerHTML = data; 
} 
// api url 
const api_url = 
	"https://norvig.com/big.txt "; 

// Defining async function 
async function getapi(url) { 
	
	// Storing response 
	const response = await fetch(url); 
	
	console.log(response); 
	if (response) { 
		hideloader(); 
	} 
	show(response); 
	return response
} 
// Calling that async function 
console.log(getapi(api_url)); 

// Function to hide the loader 
function hideloader() { 
	document.getElementById('loading').style.display = 'none'; 
} 
// Function to define innerHTML for HTML table 
function show(data) {  
	// Setting innerHTML as tab variable 
	document.getElementById("employees").innerHTML = data; 
} 
