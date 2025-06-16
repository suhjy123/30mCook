
import React, { useState } from 'react';

interface IngredientInputFormProps {
  onSubmit: (ingredients: string) => void;
  isLoading: boolean;
}

const IngredientInputForm: React.FC<IngredientInputFormProps> = ({ onSubmit, isLoading }) => {
  const [ingredients, setIngredients] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (ingredients.trim() === '') {
      alert('재료를 입력해주세요.');
      return;
    }
    onSubmit(ingredients.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-lg">
      <label htmlFor="ingredients" className="block text-lg font-semibold text-dark-text mb-2">
        주요 재료 입력
      </label>
      <textarea
        id="ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="가지고 있는 주요 재료를 쉼표로 구분하여 입력하세요 (예: 돼지고기, 김치, 양파)"
        rows={3}
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150 ease-in-out text-dark-text"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 w-full bg-primary hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            레시피 찾는 중...
          </>
        ) : (
          '레시피 찾기'
        )}
      </button>
    </form>
  );
};

export default IngredientInputForm;
