import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import Editor from 'react-simple-code-editor';
import axios from 'axios';
import Markdown from 'react-markdown';
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum(a,b){
    return a + b;
  }`)

  const [review, setReview] = useState(``)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    setReview("");
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code })
      console.log("Code review response:", response.data);
      setReview(response.data);
    } catch (error) {
      console.error("Error fetching code review:", error);
      setReview("❌ Error fetching review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="header">
        <h1>⚡ AI Code Reviewer</h1>
        <p>Write your code on the left, get AI feedback on the right</p>
      </header>

      <main>
        <div className="left">
          <h2>Your Code</h2>
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.js, 'js')}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                minHeight: "100%",
                border: "1px solid #ddd",
                borderRadius: '0.7rem',
                height: "100%",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div 
            onClick={reviewCode}
            className="review-btn"
          >
            Review Code
          </div>
        </div>

        <div className="right">
          <h2>AI Review</h2>
          <div className="review-box">
            {loading ? (
              <div className="loader">⏳ Generating review...</div>
            ) : (
              <Markdown>{review}</Markdown>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default App
