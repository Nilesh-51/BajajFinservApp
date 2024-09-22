import React, { useState } from 'react';

const App = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [apiResponse, setApiResponse] = useState(null);    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            // Validate JSON input
            const parsedInput = JSON.parse(jsonInput);

            // Call the API
            const response = await fetch('http://127.0.0.1:5000/bfhl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedInput),
            });

            // Check if response is OK (status 200)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }

            const result = await response.json();

            if (result.is_success) {
                setApiResponse(result);
            } else {
                setErrorMessage('Error processing request.');
            }
        } catch (error) {
            if (error instanceof SyntaxError) {
                setErrorMessage('Invalid JSON format. Please check your input.');
            } else {
                setErrorMessage('An error occurred: ' + error.message);
            }
        }
    };

    const handleFilter = () => {
        const selectedOptions = Array.from(document.getElementById('filterSelect').selectedOptions).map(option => option.value);
        const filteredResponse = {};

        selectedOptions.forEach(option => {
            if (option === 'alphabets') {
                filteredResponse['Alphabets'] = apiResponse.alphabets.join(', ');
            } else if (option === 'numbers') {
                filteredResponse['Numbers'] = apiResponse.numbers.join(', ');
            } else if (option === 'highestLowercase') {
                filteredResponse['Highest Lowercase Alphabet'] = apiResponse.highest_lowercase_alphabet.join(', ');
            }
        });

        document.getElementById('responseOutput').textContent = JSON.stringify(filteredResponse, null, 2);
    };

    return (
        <div className="container">
            <h1>RA2111033010136</h1>
            <form id="inputForm" onSubmit={handleSubmit}>
                <textarea 
                    id="jsonInput" 
                    value={jsonInput} 
                    onChange={(e) => setJsonInput(e.target.value)} 
                    placeholder='{"data": ["A", "C", "z"], "file_b64": "BASE_64_STRING"}' 
                    required 
                />
                <button type="submit">Submit</button>
                <p id="errorMessage" className="error">{errorMessage}</p>
            </form>

            {apiResponse && (
                <div id="filterSection">
                    <label htmlFor="filterSelect">Multi Filter:</label>
                    <select id="filterSelect" multiple>
                        <option value="alphabets">Alphabets</option>
                        <option value="numbers">Numbers</option>
                        <option value="highestLowercase">Highest Lowercase Alphabet</option>
                    </select>
                    <button id="filterButton" onClick={handleFilter}>Filter Response</button>
                </div>
            )}

            {apiResponse && (
                <div id="responseSection">
                    <h2>Filtered Response</h2>
                    <pre id="responseOutput"></pre>
                </div>
            )}
        </div>
    );
};

export default App;
