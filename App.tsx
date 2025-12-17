import React, { useState, useRef } from 'react';
import { AppStep, ScriptAnalysis, TopicSuggestion } from './types';
import { analyzeScriptAndSuggestTopics, generateNewScript, setApiKey } from './services/gemini';
import { Button } from './components/Button';
import { StepIndicator } from './components/StepIndicator';
import { ApiKeySettings } from './components/ApiKeySettings';
import { 
  Wand2, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  Copy, 
  Check, 
  BrainCircuit,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  // State
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [inputScript, setInputScript] = useState<string>('');
  const [analysis, setAnalysis] = useState<ScriptAnalysis | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicSuggestion | null>(null);
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKeyState] = useState<string>('');

  const handleApiKeySet = (key: string) => {
    setApiKeyState(key);
    setApiKey(key);
  };

  // Handlers
  const handleAnalyze = async () => {
    if (!apiKey) {
      setError("API 키를 먼저 설정해주세요.");
      return;
    }
    if (!inputScript.trim()) {
      setError("대본을 입력해주세요.");
      return;
    }
    if (inputScript.length < 50) {
        setError("분석을 위해 최소 50자 이상의 대본이 필요합니다.");
        return;
    }

    setError(null);
    setStep(AppStep.ANALYZING);

    try {
      const result = await analyzeScriptAndSuggestTopics(inputScript);
      setAnalysis(result);
      setStep(AppStep.TOPIC_SELECTION);
    } catch (err: any) {
      const errorMessage = err?.message?.includes('overloaded') || err?.message?.includes('503')
        ? "AI 서버가 일시적으로 과부하 상태입니다. 10-20초 후 다시 시도해주세요."
        : "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      setError(errorMessage);
      setStep(AppStep.INPUT);
    }
  };

  const handleGenerate = async (topic: TopicSuggestion) => {
    if (!analysis) return;

    setSelectedTopic(topic);
    setStep(AppStep.GENERATING);
    setError(null);

    try {
      const script = await generateNewScript(topic.title, analysis);
      setGeneratedScript(script);
      setStep(AppStep.RESULT);
    } catch (err: any) {
      const errorMessage = err?.message?.includes('overloaded') || err?.message?.includes('503')
        ? "AI 서버가 일시적으로 과부하 상태입니다. 10-20초 후 다른 주제를 선택해주세요."
        : "대본 생성 중 오류가 발생했습니다. 다시 시도해주세요.";
      setError(errorMessage);
      setStep(AppStep.TOPIC_SELECTION);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setInputScript('');
    setAnalysis(null);
    setSelectedTopic(null);
    setGeneratedScript('');
    setError(null);
  };

  // Render Helpers
  const renderInputStep = () => (
    <div className="animate-fade-in space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <label className="block text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            분석할 떡상 영상 대본
        </label>
        <p className="text-slate-500 text-sm mb-4">
            성공한 영상의 대본을 여기에 붙여넣으세요. 구조와 성공 요인을 분석하여 내 콘텐츠로 재탄생시킵니다.
        </p>
        <textarea
          className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-none text-slate-700 leading-relaxed"
          placeholder="여기에 대본을 붙여넣으세요..."
          value={inputScript}
          onChange={(e) => setInputScript(e.target.value)}
        />
        <div className="flex justify-between items-center mt-3 text-sm text-slate-400">
            <span>{inputScript.length}자 입력됨</span>
            {error && <span className="text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {error}</span>}
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleAnalyze} disabled={!inputScript.trim()} className="w-full sm:w-auto">
          <BrainCircuit className="w-5 h-5" />
          분석하고 아이디어 받기
        </Button>
      </div>
    </div>
  );

  const renderLoadingStep = (message: string) => (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
        </div>
      </div>
      <h3 className="mt-6 text-xl font-bold text-slate-800">{message}</h3>
      <p className="mt-2 text-slate-500 max-w-md">Gemini 1.5 Flash AI가 대본의 성공 방정식을 분석하고 있습니다...</p>
    </div>
  );

  const renderTopicSelectionStep = () => {
    if (!analysis) return null;

    return (
      <div className="animate-fade-in space-y-8">
        {/* Analysis Summary */}
        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5" />
            분석 결과: 이 영상의 성공 공식
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-indigo-800 text-sm mb-2">구조 (Structure)</h4>
              <div className="space-y-2">
                {analysis.structureSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-indigo-700 bg-white/60 p-2 rounded-lg">
                    <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                 <h4 className="font-semibold text-indigo-800 text-sm mb-1">톤앤매너</h4>
                 <p className="text-sm text-indigo-700 bg-white/60 p-2 rounded-lg">{analysis.toneAndStyle}</p>
              </div>
              <div>
                 <h4 className="font-semibold text-indigo-800 text-sm mb-1">후킹 전략</h4>
                 <p className="text-sm text-indigo-700 bg-white/60 p-2 rounded-lg">{analysis.hookStrategy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Topic Suggestions */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            이 공식으로 만들 수 있는 새로운 주제
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {analysis.suggestedTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleGenerate(topic)}
                className="group relative flex flex-col items-start text-left bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md hover:ring-1 hover:ring-indigo-500 transition-all duration-200"
              >
                <span className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 mb-2 block">
                  {topic.title}
                </span>
                <span className="text-sm text-slate-500 leading-relaxed block">
                  {topic.reason}
                </span>
                <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  이 주제로 대본 쓰기 <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleBackToTopics = () => {
    setStep(AppStep.TOPIC_SELECTION);
    setGeneratedScript('');
    setSelectedTopic(null);
  };

  const renderResultStep = () => (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">완성된 대본</h2>
          <p className="text-slate-500 mt-1">
            주제: <span className="font-semibold text-indigo-600">{selectedTopic?.title}</span>
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="secondary" onClick={handleBackToTopics} className="flex-1 md:flex-none">
            <ArrowRight className="w-4 h-4 rotate-180" />
            다른 주제 선택
          </Button>
          <Button variant="secondary" onClick={handleReset} className="flex-1 md:flex-none">
            <RefreshCw className="w-4 h-4" />
            처음으로
          </Button>
          <Button onClick={handleCopy} className="flex-1 md:flex-none min-w-[120px]">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '복사됨!' : '대본 복사'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[500px]">
        <article className="prose prose-slate max-w-none prose-headings:text-indigo-900 prose-p:text-slate-700 prose-strong:text-indigo-700">
           <ReactMarkdown>{generatedScript}</ReactMarkdown>
        </article>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <Wand2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              TubeRemaster AI
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ApiKeySettings onApiKeySet={handleApiKeySet} />
            <div className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full hidden sm:block">
              Powered by Gemini 1.5 Flash (Free)
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StepIndicator currentStep={step} />

        {step === AppStep.INPUT && renderInputStep()}
        {step === AppStep.ANALYZING && renderLoadingStep("대본 구조를 분석하고 있습니다...")}
        {step === AppStep.TOPIC_SELECTION && renderTopicSelectionStep()}
        {step === AppStep.GENERATING && renderLoadingStep("선택한 주제로 대본을 작성하고 있습니다...")}
        {step === AppStep.RESULT && renderResultStep()}
      </main>

       {/* Footer */}
       <footer className="py-8 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} TubeRemaster AI. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
