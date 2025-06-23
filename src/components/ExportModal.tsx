import React, { useState } from "react";
import { useEmailBuilderContext } from "../hooks/useEmailBuilder";
import { IconDownload, IconCopy, IconCode, IconMail, IconX, IconSend } from '@tabler/icons-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function validateEmail(email: string) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const TestYourEmail: React.FC<{ html: string }> = ({ html }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromError, setFromError] = useState("");
  const [toError, setToError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleTest = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    setFromError("");
    setToError("");
    setSuccess(false);
    if (!validateEmail(from)) {
      setFromError("This is not a valid email address. Please double check your email and try again.");
      valid = false;
    }
    const emails = to.split(",").map(e => e.trim()).filter(Boolean);
    if (!emails.length || !emails.every(validateEmail)) {
      setToError("Please enter one or more valid email addresses, separated by commas.");
      valid = false;
    }
    if (!valid) return;
    // For now, just log the data
    // In the future, this will call the backend endpoint
    // eslint-disable-next-line no-console
    console.log({ from, to: emails, html });
    setSuccess(true);
  };

  return (
    <div className="border-t pt-6 mt-6">
      <h4 className="font-medium mb-3">Test Your Email</h4>
      <p className="text-sm text-gray-600 mb-4">Test your email before sending to your recipients.</p>
      <form onSubmit={handleTest} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">From Address</label>
          <input
            type="email"
            value={from}
            onChange={e => setFrom(e.target.value)}
            className={`w-full border-b-2 px-3 py-2 text-sm focus:outline-none ${fromError ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="your@email.com"
          />
          {fromError && <div className="text-xs text-red-600 mt-1">{fromError}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Send a Test Email</label>
          <input
            type="text"
            value={to}
            onChange={e => setTo(e.target.value)}
            className={`w-full border-b-2 px-3 py-2 text-sm focus:outline-none ${toError ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="test1@email.com, test2@email.com"
          />
          {toError && <div className="text-xs text-red-600 mt-1">{toError}</div>}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-600"
        >
          <IconSend size={16} />
          <span>Send Test Email</span>
        </button>
        {success && <div className="text-green-600 text-sm mt-2">Test email data logged to console!</div>}
      </form>
    </div>
  );
};

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { generateHTML, exportHTML, copyHTML, getEmailData } = useEmailBuilderContext();
  const [filename, setFilename] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showHTML, setShowHTML] = useState(false);

  const emailData = getEmailData();
  const defaultFilename = emailData.subject 
    ? `${emailData.subject.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`
    : 'email-template.html';

  const handleExport = () => {
    exportHTML(filename || defaultFilename);
    onClose();
  };

  const handleCopy = async () => {
    setIsCopying(true);
    const success = await copyHTML();
    setCopySuccess(success);
    setIsCopying(false);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShowHTML = () => {
    setShowHTML(!showHTML);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-medium">Export Email Template</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <IconX size={20} />
          </button>
        </div>
        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-auto p-6 space-y-6">
          {/* Email Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Email Information</h4>
            <div className="space-y-1 text-sm">
              <div><strong>Subject:</strong> {emailData.subject || 'No subject'}</div>
              <div><strong>Preheader:</strong> {emailData.preheader || 'No preheader'}</div>
              <div><strong>Modules:</strong> {emailData.modules.length} modules</div>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Export Options</h4>
            
            {/* Download HTML */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconDownload className="text-blue-500" size={20} />
                  <div>
                    <h5 className="font-medium">Download HTML File</h5>
                    <p className="text-sm text-gray-600">Download the complete HTML email template</p>
                  </div>
                </div>
                <button
                  onClick={handleExport}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Download
                </button>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">Filename (optional):</label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder={defaultFilename}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Copy HTML */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconCopy className="text-green-500" size={20} />
                  <div>
                    <h5 className="font-medium">Copy HTML to Clipboard</h5>
                    <p className="text-sm text-gray-600">Copy the HTML code to paste elsewhere</p>
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  disabled={isCopying}
                  className={`px-4 py-2 rounded ${
                    isCopying 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : copySuccess
                      ? 'bg-green-500 text-white'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isCopying ? 'Copying...' : copySuccess ? 'Copied!' : 'Copy HTML'}
                </button>
              </div>
            </div>

            {/* View HTML */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconCode className="text-purple-500" size={20} />
                  <div>
                    <h5 className="font-medium">View HTML Code</h5>
                    <p className="text-sm text-gray-600">Preview the generated HTML code</p>
                  </div>
                </div>
                <button
                  onClick={handleShowHTML}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  {showHTML ? 'Hide HTML' : 'View HTML'}
                </button>
              </div>
            </div>

            {/* Email Data */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconMail className="text-orange-500" size={20} />
                  <div>
                    <h5 className="font-medium">Email Data (JSON)</h5>
                    <p className="text-sm text-gray-600">Get the complete email data structure</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(emailData, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'email-data.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  Download JSON
                </button>
              </div>
            </div>
          </div>

          {/* HTML Preview */}
          {showHTML && (
            <div className="border rounded-lg p-4">
              <h5 className="font-medium mb-3">Generated HTML Code</h5>
              <div className="bg-gray-900 text-gray-100 p-4 rounded max-h-96 overflow-auto">
                <pre className="text-xs whitespace-pre-wrap">{generateHTML()}</pre>
              </div>
            </div>
          )}

          {/* Test Your Email Section */}
          <TestYourEmail html={generateHTML()} />
        </div>
        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex-shrink-0">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 