// Page component responsible for the McpQuestion screen.
import { useEffect, useState, ChangeEvent, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import mcpService from "../../3-services/mcp-service";
import "./McpQuestion.css"

// Render the MCP question page for logged-in users.
function McpQuestion() {
    const [question, setQuestion] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [error, setError] = useState<string>("");
   
    const navigate = useNavigate();

    // Run side effects such as redirects or initial data loading when the component mounts.
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    // Update local component state when the user changes an input field.
    function handleChange(args: ChangeEvent<HTMLInputElement>) {
        setQuestion(args.target.value);
    }

        // Send the question to the MCP endpoint and display the answer.
    async function send(event: SyntheticEvent): Promise<void> {
        event.preventDefault();
        setError("");
        setAnswer("");

        if (!question.trim()) {
            setError("Question is required.");
            return;
        }

        try {
            const reply = await mcpService.askQuestion(question);
            setAnswer(reply);
        }
        catch (err: any) {
            setError(err.response?.data || "Failed to get answer.");
        }
    }

    return (
        <div className="McpQuestion">
            <div className="mcp-card">
                <h2>MCP Question</h2>
                <p className="mcp-subtitle">Ask questions about the vacations database</p>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={send} noValidate>
                    <input type="text" name="question" placeholder="Ask about the vacations database" value={question} onChange={handleChange}  />
                    <button type="submit">Ask</button>
                </form>

                {answer && (
                    <div className="answer-box">
                        <p>{answer}</p>
                    </div>
                )}
            </div>
        </div>
    );
}


export default McpQuestion;