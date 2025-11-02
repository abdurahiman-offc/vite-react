import { useEffect, useState } from "react";
import Papa from "papaparse"; // To parse CSV easily

import './App.css'

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1CyjtQmDF-phomRdFyUaP3vtr3jfRRIl8FRLxFQCkll0/export?format=csv";

function App() {
 const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(GOOGLE_SHEET_CSV_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch Google Sheet");
        return response.text();
      })
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: true });
        setData(parsed.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading data from Google Sheet...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  if (!data.length) return <p>No data found.</p>;

  const headers = Object.keys(data[0]);

  return (
    <div className="App">
      <h2>📊 Google Sheet Data</h2>
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {headers.map((header) => (
                <td key={header}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App
