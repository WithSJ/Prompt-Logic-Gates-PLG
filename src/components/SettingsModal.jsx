import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Settings, Sparkles, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { callAI } from '../compiler/semanticCompiler';

export default function SettingsModal({ isOpen, onClose, settings, onSave }) {
  const [mode, setMode] = useState(settings.mode);
  const [provider, setProvider] = useState(settings.provider);
  const [keys, setKeys] = useState({ ...settings.keys });
  const [models, setModels] = useState({ ...settings.models });
  const [showKeys, setShowKeys] = useState({});
  const [testStatus, setTestStatus] = useState({ show: false, type: '', text: '' });
  const [testing, setTesting] = useState(false);

  // Synchronize internal state whenever the modal is opened or settings prop changes
  useEffect(() => {
    if (isOpen) {
      setMode(settings.mode);
      setProvider(settings.provider);
      setKeys({ ...settings.keys });
      setModels({ ...settings.models });
      setTestStatus({ show: false, type: '', text: '' });
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const toggleShowKey = (prov) => {
    setShowKeys((prev) => ({ ...prev, [prov]: !prev[prov] }));
  };

  const handleKeyChange = (prov, val) => {
    setKeys((prev) => ({ ...prev, [prov]: val }));
  };

  const handleModelChange = (prov, val) => {
    setModels((prev) => ({ ...prev, [prov]: val }));
  };

  const handleSave = () => {
    onSave({ mode, provider, keys, models });
    onClose();
  };

  const handleTestConnection = async () => {
    const key = keys[provider];
    if (!key) {
      setTestStatus({ show: true, type: 'err', text: '⚠ Enter an API key first.' });
      return;
    }

    setTesting(true);
    setTestStatus({ show: true, type: 'load', text: `Pinging ${getProviderLabel(provider)}...` });

    try {
      const response = await callAI(
        'You are a connection test. Reply with the single word OK.',
        'Reply with OK.',
        { provider, keys, models }
      );
      
      const cleanRes = (response || '').trim();
      setTestStatus({
        show: true,
        type: 'ok',
        text: `✓ Connected! Response: "${cleanRes.slice(0, 30)}"`
      });
    } catch (err) {
      setTestStatus({
        show: true,
        type: 'err',
        text: `✕ ${err.message || String(err)}`
      });
    } finally {
      setTesting(false);
    }
  };

  const getProviderLabel = (p) => {
    return { anthropic: 'Claude', openai: 'ChatGPT', google: 'Gemini', openrouter: 'OpenRouter' }[p];
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-h">
          <Settings style={{ color: 'var(--prompt)', width: 20, height: 20 }} />
          <span className="ti">Connect AI Models</span>
          <button className="x" onClick={onClose}>×</button>
        </div>
        <div className="modal-b">
          <div className="modal-note">
            The semantic compiler can run <b>offline (rule-based)</b> or <b>AI-assisted</b>. In AI mode, the compiler asks your chosen model to categorize, rank, de-conflict, and select prompts. Keys stay <b>in this browser only</b> and are sent directly to the provider.
          </div>

          <div className="fld">
            <label>Compiler Mode</label>
            <div className="seg">
              <button
                className={mode === 'rule' ? 'active' : ''}
                onClick={() => setMode('rule')}
              >
                <span className="pdot" style={{ background: 'var(--txt-faint)' }}></span>
                Rule-based (offline)
              </button>
              <button
                className={mode === 'ai' ? 'active' : ''}
                onClick={() => setMode('ai')}
              >
                <span className="pdot" style={{ background: 'var(--or)' }}></span>
                AI-assisted
              </button>
            </div>
          </div>

          <div className="fld">
            <label>Active Provider</label>
            <div className="seg">
              <button
                className={provider === 'anthropic' ? 'active' : ''}
                onClick={() => setProvider('anthropic')}
              >
                <span className="pdot" style={{ background: '#d97757' }}></span>
                Claude
              </button>
              <button
                className={provider === 'openai' ? 'active' : ''}
                onClick={() => setProvider('openai')}
              >
                <span className="pdot" style={{ background: '#10a37f' }}></span>
                ChatGPT
              </button>
              <button
                className={provider === 'google' ? 'active' : ''}
                onClick={() => setProvider('google')}
              >
                <span className="pdot" style={{ background: '#4285f4' }}></span>
                Gemini
              </button>
              <button
                className={provider === 'openrouter' ? 'active' : ''}
                onClick={() => setProvider('openrouter')}
              >
                <span className="pdot" style={{ background: '#8b8bff' }}></span>
                OpenRouter
              </button>
            </div>
          </div>

          {/* Configuration panels per provider */}
          <div>
            <div className="fld">
              <label>{getProviderLabel(provider)} API Key</label>
              <div className="keywrap">
                <input
                  type={showKeys[provider] ? 'text' : 'password'}
                  value={keys[provider] || ''}
                  onChange={(e) => handleKeyChange(provider, e.target.value)}
                  placeholder={
                    provider === 'anthropic' ? 'sk-ant-...' :
                    provider === 'openai' ? 'sk-...' :
                    provider === 'google' ? 'AIza...' : 'sk-or-...'
                  }
                />
                <button className="eye" onClick={() => toggleShowKey(provider)}>
                  {showKeys[provider] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="hint2">
                {provider === 'anthropic' && (
                  <>Get a key at <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">console.anthropic.com</a></>
                )}
                {provider === 'openai' && (
                  <>Get a key at <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">platform.openai.com</a></>
                )}
                {provider === 'google' && (
                  <>Get a key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">aistudio.google.com</a></>
                )}
                {provider === 'openrouter' && (
                  <>Get a key at <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer">openrouter.ai</a></>
                )}
              </div>
            </div>

            <div className="fld">
              <label>Model Version</label>
              <input
                type="text"
                value={models[provider] || ''}
                onChange={(e) => handleModelChange(provider, e.target.value)}
                placeholder={
                  provider === 'anthropic' ? 'claude-3-5-sonnet-latest' :
                  provider === 'openai' ? 'gpt-4o-mini' :
                  provider === 'google' ? 'gemini-1.5-flash' : 'openai/gpt-4o-mini'
                }
              />
            </div>
          </div>

          <button
            className="tbtn"
            style={{ width: '100%', justifyContent: 'center', height: 40, marginTop: 12 }}
            onClick={handleTestConnection}
            disabled={testing}
          >
            {testing ? (
              <Loader2 className="spin" size={16} />
            ) : (
              <Sparkles size={16} />
            )}
            Test Connection
          </button>

          {testStatus.show && (
            <div className={`modal-status show ${testStatus.type}`}>
              {testStatus.type === 'load' && <span className="spin"></span>}
              {testStatus.type === 'ok' && <Check size={14} />}
              {testStatus.type === 'err' && <AlertTriangle size={14} />}
              <span>{testStatus.text}</span>
            </div>
          )}
        </div>
        <div className="modal-f">
          <button
            className="tbtn primary"
            style={{
              background: 'linear-gradient(180deg,#0e9f6e,#057a55)',
              borderColor: '#0e9f6e'
            }}
            onClick={handleSave}
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
