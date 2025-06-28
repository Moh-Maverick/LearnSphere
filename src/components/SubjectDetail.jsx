"use client";

import { useState, useMemo, useEffect } from "react";
import { MessageSquare, FileText, Upload, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "../lib/supabaseClient";
import ReactMarkdown from "react-markdown";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://learnsphere-q6ko.onrender.com";

const SubjectDetail = ({ subject, onBack }) => {
    const [chatMessage, setChatMessage] = useState("");
    const [quizTopic, setQuizTopic] = useState("");
    const [textToSummarize, setTextToSummarize] = useState("");
    const [activeTab, setActiveTab] = useState("tutor");
    const [notes, setNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [aiAnswer, setAiAnswer] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [quiz, setQuiz] = useState("");
    const [quizLoading, setQuizLoading] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [userQuizAnswers, setUserQuizAnswers] = useState([]);
    const [quizScore, setQuizScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [showAnswerResult, setShowAnswerResult] = useState(false);
    const [selectedNoteId, setSelectedNoteId] = useState("");
    const [summary, setSummary] = useState("");
    const [summaryLoading, setSummaryLoading] = useState(false);

    const tools = [
        {
            id: "tutor",
            title: "AI Tutor",
            description: "Ask questions and get personalized explanations",
            icon: MessageSquare,
            color: "from-blue-400 to-blue-600"
        },
        {
            id: "quiz",
            title: "Quiz Generator",
            description: "Generate practice questions from your notes",
            icon: FileText,
            color: "from-green-400 to-green-600"
        },
        {
            id: "summarizer",
            title: "Summarizer",
            description: "Get concise summaries of complex topics",
            icon: Upload,
            color: "from-purple-400 to-purple-600"
        }
    ];

    // Fix hydration for stars
    const stars = useMemo(() =>
        Array.from({ length: 30 }, () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
        })),
        []
    );

    const fetchNotes = async () => {
        setLoadingNotes(true);
        setShowNotes(true);
        setNotes([]);
        // Get token from supabase
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const res = await fetch(`${BACKEND_URL}/notes?planet_id=${subject.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            setNotes(await res.json());
        } else {
            setNotes([]);
        }
        setLoadingNotes(false);
    };

    const handleAskAi = async () => {
        if (!chatMessage.trim()) return;
        setAiLoading(true);
        setAiAnswer("");
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const res = await fetch(`${BACKEND_URL}/ai-tutor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                question: chatMessage,
                planet_id: subject.id,
            }),
        });
        const data = await res.json();
        setAiAnswer(data.answer);
        setAiLoading(false);
    };

    const handleGenerateQuiz = async () => {
        console.log("Generate Quiz button clicked");
        setQuizLoading(true);
        setQuiz("");
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const res = await fetch(`${BACKEND_URL}/quiz-generator`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    planet_id: subject.id,
                    topic: quizTopic,
                }),
            });
            const data = await res.json();
            console.log("Quiz response:", data);
            setQuiz(data.quiz);
        } catch (err) {
            console.error("Quiz generation error:", err);
            setQuiz("An error occurred while generating the quiz.");
        }
        setQuizLoading(false);
    };

    // Helper to parse quiz string into questions (assuming markdown format)
    function parseQuiz(quizText) {
        if (!quizText) return [];
        const questionBlocks = quizText.split(/\n(?=\d+\.)/).filter(Boolean);
        return questionBlocks
            .map(block => {
                const lines = block.trim().split('\n');
                const questionLine = lines[0].replace(/^\d+\.\s*/, '');
                const options = lines.filter(line => /^[a-dA-D][\).]/.test(line)).map(line => line.replace(/^[a-dA-D][\).]\s*/, ''));
                // Find the answer line
                const answerLine = lines.find(line => /^Answer:\s*[a-dA-D]/.test(line));
                let correct = 0;
                if (answerLine) {
                    const answerLetter = answerLine.match(/^Answer:\s*([a-dA-D])/);
                    if (answerLetter) {
                        correct = answerLetter[1].toLowerCase().charCodeAt(0) - 97; // 'a' -> 0, 'b' -> 1, etc.
                    }
                }
                return { question: questionLine, options, correct };
            })
            .filter(q => q.options.length >= 2);
    }

    const quizQuestions = parseQuiz(quiz).slice(0, 5); // Only 5 questions

    const handleSelectQuizOption = (optionIdx) => {
        if (showAnswerResult) return;
        setUserQuizAnswers(prev => {
            const updated = [...prev];
            updated[currentQuestionIdx] = optionIdx;
            return updated;
        });
    };

    const handleSubmitQuizOption = () => {
        if (showAnswerResult) return;
        const currentQ = quizQuestions[currentQuestionIdx];
        const userAnswer = userQuizAnswers[currentQuestionIdx];
        if (userAnswer === currentQ.correct) {
            setQuizScore(score => score + 1);
        }
        setShowAnswerResult(true);
    };

    const handleNextQuizQuestion = () => {
        setShowAnswerResult(false);
        if (currentQuestionIdx < quizQuestions.length - 1) {
            setCurrentQuestionIdx(idx => idx + 1);
        } else {
            setQuizFinished(true);
        }
    };

    const handleRestartQuiz = () => {
        setCurrentQuestionIdx(0);
        setUserQuizAnswers([]);
        setQuizScore(0);
        setQuizFinished(false);
        setShowAnswerResult(false);
    };

    const handleGenerateSummary = async () => {
        if (!selectedNoteId) return;
        setSummaryLoading(true);
        setSummary("");
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const res = await fetch(`${BACKEND_URL}/summarize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    planet_id: subject.id,
                    note_id: selectedNoteId,
                }),
            });
            const data = await res.json();
            setSummary(data.summary);
        } catch (err) {
            setSummary("An error occurred while generating the summary.");
        }
        setSummaryLoading(false);
    };

    useEffect(() => {
        if (activeTab === "summarizer" && notes.length === 0) {
            fetchNotes();
        }
    }, [activeTab]);

    return (
        <div className="min-h-screen p-6">
            {/* Animated background stars */}
            <div className="stars">
                {stars.map((style, i) => (
                    <div key={i} className="star" style={style} />
                ))}
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        className="text-space-bright hover:bg-white/10 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-white">{subject.name}</h1>
                        <p className="text-space-bright/70">{subject.notesCount} notes • Last accessed {subject.lastAccessed}</p>
                    </div>
                </div>

                <Button onClick={fetchNotes} className="cosmic-button mb-4">
                    View Notes
                </Button>
                {showNotes && (
                    <div className="mb-8">
                        {loadingNotes && <p className="text-space-bright/60">Loading notes...</p>}
                        {!loadingNotes && notes.length === 0 && <p className="text-space-bright/60">No notes uploaded yet.</p>}
                        {!loadingNotes && notes.length > 0 && (
                            <ul className="space-y-2">
                                {notes.map(note => (
                                    <li key={note.id} className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between">
                                        <span className="text-white">{note.title}</span>
                                        <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="text-space-accent underline ml-4">View</a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* AI Tools */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
                        <TabsTrigger value="tutor" className="text-white data-[state=active]:bg-space-accent data-[state=active]:font-bold data-[state=active]:shadow-lg">AI Tutor</TabsTrigger>
                        <TabsTrigger value="quiz" className="text-white data-[state=active]:bg-space-accent data-[state=active]:font-bold data-[state=active]:shadow-lg">Quiz Generator</TabsTrigger>
                        <TabsTrigger value="summarizer" className="text-white data-[state=active]:bg-space-accent data-[state=active]:font-bold data-[state=active]:shadow-lg">Summarizer</TabsTrigger>
                    </TabsList>

                    {/* AI Tutor */}
                    <TabsContent value="tutor">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                                    AI Tutor
                                </CardTitle>
                                <CardDescription className="text-space-bright/70">
                                    Ask me anything about {subject.name}. I'll help explain concepts based on your notes.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-white/5 rounded-lg p-4 min-h-[300px] border border-white/10">
                                    {aiLoading ? (
                                        <p className="text-space-bright/60 text-center mt-20">Thinking...</p>
                                    ) : aiAnswer ? (
                                        <div className="text-white whitespace-pre-line">
                                            <ReactMarkdown>{aiAnswer}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-space-bright/60 text-center mt-20">
                                            Start a conversation with your AI tutor
                                        </p>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Ask a question about your notes..."
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        onKeyDown={e => { if (e.key === 'Enter') handleAskAi(); }}
                                    />
                                    <Button className="cosmic-button" onClick={handleAskAi} disabled={aiLoading}>
                                        {aiLoading ? "..." : "Send"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Quiz Generator */}
                    <TabsContent value="quiz">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-green-400" />
                                    Quiz Generator
                                </CardTitle>
                                <CardDescription className="text-space-bright/70">
                                    Generate practice questions based on your {subject.name} notes.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <Input
                                        placeholder="Enter a specific topic (optional)"
                                        value={quizTopic}
                                        onChange={(e) => setQuizTopic(e.target.value)}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                    />
                                    {/* Custom Button with direct click logging, always enabled */}
                                    <Button
                                        className="cosmic-button w-full"
                                        onClick={() => { console.log("Direct click!"); handleGenerateQuiz(); setQuizFinished(false); setQuizScore(0); setCurrentQuestionIdx(0); setUserQuizAnswers([]); setShowAnswerResult(false); }}
                                        type="button"
                                    >
                                        {quizLoading ? "Generating..." : "Generate Quiz Questions"}
                                    </Button>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 min-h-[200px] border border-white/10">
                                    {quizLoading ? (
                                        <p className="text-space-bright/60 text-center mt-16">Generating quiz questions...</p>
                                    ) : quizQuestions.length > 0 ? (
                                        quizFinished ? (
                                            <div className="text-center">
                                                <div className="text-2xl text-white font-bold mb-4">Quiz Finished!</div>
                                                <div className="text-xl text-space-accent mb-4">Your Score: {quizScore} / {quizQuestions.length}</div>
                                                <Button className="cosmic-button" onClick={handleRestartQuiz}>Restart Quiz</Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="font-semibold text-white mb-4">Question {currentQuestionIdx + 1} of {quizQuestions.length}</div>
                                                <div className="text-lg text-white mb-4">{quizQuestions[currentQuestionIdx].question}</div>
                                                <div className="space-y-2 mb-4">
                                                    {quizQuestions[currentQuestionIdx].options.map((opt, oIdx) => (
                                                        <label key={oIdx} className={`flex items-center space-x-2 cursor-pointer rounded px-2 py-1 ${userQuizAnswers[currentQuestionIdx] === oIdx ? 'bg-space-accent text-white' : 'bg-transparent text-white'}`}>
                                                            <input
                                                                type="radio"
                                                                name={`quiz-question-${currentQuestionIdx}`}
                                                                value={oIdx}
                                                                checked={userQuizAnswers[currentQuestionIdx] === oIdx}
                                                                onChange={() => handleSelectQuizOption(oIdx)}
                                                                disabled={showAnswerResult}
                                                            />
                                                            <span>{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                {!showAnswerResult && (
                                                    <Button className="cosmic-button w-full" onClick={handleSubmitQuizOption} disabled={userQuizAnswers[currentQuestionIdx] === undefined}>Submit</Button>
                                                )}
                                                {showAnswerResult && (
                                                    <div className="mt-4">
                                                        {userQuizAnswers[currentQuestionIdx] === quizQuestions[currentQuestionIdx].correct ? (
                                                            <div className="text-green-400 font-bold mb-2">Correct!</div>
                                                        ) : (
                                                            <div className="text-red-400 font-bold mb-2">Incorrect. Correct answer: {quizQuestions[currentQuestionIdx].options[quizQuestions[currentQuestionIdx].correct]}</div>
                                                        )}
                                                        <Button className="cosmic-button w-full mt-2" onClick={handleNextQuizQuestion}>
                                                            {currentQuestionIdx === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    ) : (
                                        <p className="text-space-bright/60 text-center mt-16">
                                            No valid multiple-choice questions found. Please try again or check your notes.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Summarizer */}
                    <TabsContent value="summarizer">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <Upload className="w-5 h-5 mr-2 text-purple-400" />
                                    Summarizer
                                </CardTitle>
                                <CardDescription className="text-space-bright/70">
                                    Get concise summaries of your Computer Networks content.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Dropdown to select a note */}
                                <div>
                                    <label htmlFor="note-select" className="block text-white mb-2">Select a note to summarize:</label>
                                    <select
                                        id="note-select"
                                        value={selectedNoteId || ''}
                                        onChange={e => setSelectedNoteId(e.target.value)}
                                        className="bg-space-dark border border-space-accent/30 text-white placeholder:text-space-bright/60 w-full rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-space-accent transition-all duration-200 text-base shadow-md"
                                        style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', colorScheme: 'dark' }}
                                    >
                                        <option value="" className="bg-space-dark text-space-bright/60">-- Select a note --</option>
                                        {notes.map(note => (
                                            <option key={note.id} value={note.id} className="bg-space-dark text-white hover:bg-space-accent/20">{note.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <Button className="cosmic-button w-full" onClick={handleGenerateSummary} disabled={!selectedNoteId}>
                                    Generate Summary
                                </Button>
                            </CardContent>
                            <CardContent className="space-y-4">
                                <div className="bg-white/5 rounded-lg p-4 min-h-[120px] border border-white/10">
                                    {summaryLoading ? (
                                        <p className="text-space-bright/60 text-center mt-16">Generating summary...</p>
                                    ) : summary ? (
                                        <div className="text-white whitespace-pre-line">{summary}</div>
                                    ) : (
                                        <p className="text-space-bright/60 text-center mt-16">Summary will appear here</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default SubjectDetail; 