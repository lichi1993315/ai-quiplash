import React, { FormEvent } from 'react';
import { Send } from 'lucide-react';

interface AnswerFormProps {
  onSubmit: (answer: string) => void;
}

export const AnswerForm: React.FC<AnswerFormProps> = ({ onSubmit }) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('answer') as HTMLInputElement;
    onSubmit(input.value);
    input.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        name="answer"
        className="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Type your answer..."
        maxLength={100}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
      >
        <Send className="w-4 h-4" />
        <span>Submit</span>
      </button>
    </form>
  );
};