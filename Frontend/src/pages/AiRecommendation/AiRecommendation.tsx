// Page component responsible for the AiRecommendation screen.
import { useEffect, useState, ChangeEvent, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import aiService from "../../3-services/ai-service";
import "./AiRecommendation.css";

// Render the AI recommendation page for logged-in users.
function AiRecommendation() {
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
    function handleChange(args: ChangeEvent<HTMLInputElement>): void {
        setQuestion(args.target.value);
    }

    // Send the destination to the AI endpoint and show the answer.
    async function send(event: SyntheticEvent): Promise<void> {
        event.preventDefault();

        setError("");
        setAnswer("");

        if (!question.trim()) {
            setError("Destination is required.");
            return;
        }

        try {
            const recommendation = await aiService.getRecommendation(question);
            setAnswer(recommendation);
        }
        catch (err: any) {
            setError(err.response?.data || "Failed to get recommendation.");
        }
    }

    // Split the response into display lines for a cleaner UI.
    const answerLines = answer
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

    return (
        <div className="AiRecommendationPage">
            <div className="AiHeroCard">
                <div className="ai-hero">
                    <div className="sun"></div>
                    <div className="sea"></div>
                    <div className="sand"></div>

                    <div className="robot-scene">
                        <div className="towel"></div>
                        <div className="umbrella"></div>

                        <div className="robot">
                            <div className="robot-head">
                                <div className="robot-antenna"></div>
                                <div className="robot-eyes">
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>

                            <div className="robot-body"></div>

                            <div className="robot-arm robot-arm-left"></div>
                            <div className="robot-arm robot-arm-right"></div>

                            <div className="robot-leg robot-leg-left"></div>
                            <div className="robot-leg robot-leg-right"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="AiRecommendation">
                <h2>AI Recommendation</h2>

                {error && <p className="error-message">{error}</p>}
                <form onSubmit={send} noValidate>
                    <input type="text" name="question" placeholder="Enter destination" value={question} onChange={handleChange} />
                    <button type="submit">Get Recommendation</button>
                </form>
                {answerLines.length > 0 && (
                    <div className="recommendation-box">
                        {answerLines.map((line, index) => (
                            <p key={index} className="recommendation-line">
                                {line}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AiRecommendation;