import React, { useState, useEffect } from 'react';
import { Key, X, Check, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ApiKeySettingsProps {
  onApiKeySet: (apiKey: string) => void;
}

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 API 키 확인
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setHasApiKey(true);
      onApiKeySet(savedKey);
    } else {
      setIsOpen(true); // API 키가 없으면 자동으로 모달 열기
    }
  }, [onApiKeySet]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      return;
    }

    // 로컬 스토리지에 API 키 저장
    localStorage.setItem('gemini_api_key', apiKey.trim());
    setHasApiKey(true);
    onApiKeySet(apiKey.trim());
    setShowSuccess(true);
    
    setTimeout(() => {
      setIsOpen(false);
      setShowSuccess(false);
    }, 1500);
  };

  const handleDelete = () => {
    localStorage.removeItem('gemini_api_key');
    setHasApiKey(false);
    setApiKey('');
    onApiKeySet('');
    setIsOpen(true);
  };

  if (!isOpen && hasApiKey) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-full transition-all"
      >
        <Key className="w-3.5 h-3.5" />
        API 키 관리
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {!hasApiKey && (
          <div className="absolute top-4 right-4">
            <div className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              필수
            </div>
          </div>
        )}
        
        {hasApiKey && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <Key className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Gemini API 키 설정</h2>
            <p className="text-sm text-slate-500">한 번만 입력하면 자동 저장됩니다</p>
          </div>
        </div>

        {showSuccess ? (
          <div className="py-8 flex flex-col items-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-green-600 font-semibold">API 키가 저장되었습니다!</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                API 키
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              />
              <p className="mt-2 text-xs text-slate-500">
                Google AI Studio에서 무료로 발급받을 수 있습니다
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">API 키 발급 방법</h3>
              <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                <li>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    Google AI Studio
                  </a>에 접속
                </li>
                <li>Google 계정으로 로그인</li>
                <li>"Get API Key" 또는 "Create API Key" 클릭</li>
                <li>생성된 키를 복사하여 위에 붙여넣기</li>
              </ol>
            </div>

            <div className="flex gap-3">
              {hasApiKey && (
                <Button
                  variant="secondary"
                  onClick={handleDelete}
                  className="flex-1"
                >
                  삭제
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="flex-1"
              >
                저장
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
