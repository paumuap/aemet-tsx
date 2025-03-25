import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);
  const [aguas, setAguas] = useState<any>(null);
  const [errorResponse, setErrorResponse] = useState<Error | null>(null);
  const [errorDetails, setErrorDetails] = useState<Error | null>(null);

  const handleFetch = async () => {
    try {
      let API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwLmxpbmFnZXJtYW5AZ21haWwuY29tIiwianRpIjoiMmNkMmM1MWUtMmE0Yi00ZTQyLWE4NWMtZGFmNDMyYTMxNTRlIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE3NDIzMTY2NjQsInVzZXJJZCI6IjJjZDJjNTFlLTJhNGItNGU0Mi1hODVjLWRhZjQzMmEzMTU0ZSIsInJvbGUiOiIifQ.3ghxt5xFpfy4dgQLGw8_j2JiKHUDIayFoQKtqsar4XE";
      
      const response = await fetch(`https://opendata.aemet.es/opendata/api/prediccion/especifica/playa/${input}/?api_key=${API_KEY}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setResponse(data);
      setErrorResponse(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorResponse(error instanceof Error ? error : new Error("Unknown error occurred"));
      setResponse(null);
    }
  };

  const handleAemetData = async () => {
    try {
      // let API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwLmxpbmFnZXJtYW5AZ21haWwuY29tIiwianRpIjoiMmNkMmM1MWUtMmE0Yi00ZTQyLWE4NWMtZGFmNDMyYTMxNTRlIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE3NDIzMTY2NjQsInVzZXJJZCI6IjJjZDJjNTFlLTJhNGItNGU0Mi1hODVjLWRhZjQzMmEzMTU0ZSIsInJvbGUiOiIifQ.3ghxt5xFpfy4dgQLGw8_j2JiKHUDIayFoQKtqsar4XE";
      const details = await fetch(response.datos);
      const data = await details.json();
      const taguas = data[0].prediccion.dia.map(dia => dia.tAgua.valor1);

      setDetails(data);
      setAguas(taguas);
      setErrorDetails(null);
    } catch (error) {
      setErrorDetails(error instanceof Error ? error : new Error("Unknown error occurred"));
      setDetails(null);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <label className="block text-lg font-semibold">Enter Playa Codigo (i.e. 0301101):</label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleFetch}
        className="w-full bg-blue-500 text-black py-2 rounded hover:bg-blue-600"
      > Fetch Playa Metadata </button>
      {response && (
        <pre className="mt-4 p-2 bg-gray-100 rounded text-sm border rounded">
          Initial Response: {JSON.stringify(response, null, 2)}
        </pre>
      )}
      {errorResponse && (
        <div className="mt-4 p-2 text-danger border border-danger">
          {errorResponse.message}
        </div>
      )}
      {response && (<button
        onClick={handleAemetData}
        className="w-full bg-blue-500 text-black py-2 rounded hover:bg-blue-600"
      > Fetch Playa Aemet Details </button>)}
      {aguas && (
        <pre className="mt-4 p-2 bg-gray-100 rounded text-sm border rounded">
          Playa Aguas: {JSON.stringify(aguas, null, 2)}
        </pre>
      )}
      {details && (
        <pre className="mt-4 p-2 bg-gray-100 rounded text-sm border rounded">
          Playa Details: {JSON.stringify(details, null, 2)}
        </pre>
      )}
      {errorDetails && (
        <div className="mt-4 p-2 text-danger border border-danger">
          {errorDetails.message}
        </div>
      )}
    </div>
  );
}
