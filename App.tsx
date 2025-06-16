
import React, { useState, useCallback } from 'react';
import { Recipe } from './types';
import { fetchRecipesFromIngredients } from './services/geminiService';
import IngredientInputForm from './components/IngredientInputForm';
import RecipeCard from './components/RecipeCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchRecipes = useCallback(async (ingredients: string) => {
    setIsLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const fetchedRecipes = await fetchRecipesFromIngredients(ingredients);
      if (fetchedRecipes.length === 0) {
        setError('입력하신 재료로 만들 수 있는 30분 내 레시피를 찾지 못했습니다. 다른 재료를 시도해보세요.');
      } else {
        setRecipes(fetchedRecipes);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
            30분 요리 도우미
          </h1>
          <p className="mt-3 text-lg text-medium-text">
            가지고 있는 재료로 빠르고 맛있는 요리를 찾아보세요!
          </p>
        </header>

        <IngredientInputForm onSubmit={handleFetchRecipes} isLoading={isLoading} />

        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!isLoading && !error && recipes.length > 0 && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold text-dark-text mb-6 text-center">추천 레시피</h2>
            <div className="grid grid-cols-1 gap-8">
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
              ))}
            </div>
          </div>
        )}
        
        {!isLoading && !error && recipes.length === 0 && !recipes && ( // Initial state or no results
           <div className="text-center text-medium-text mt-10 p-6 bg-white rounded-lg shadow">
            <p>찾고 싶은 요리의 주요 재료를 입력하고 "레시피 찾기" 버튼을 눌러주세요.</p>
          </div>
        )}
      </div>
      <footer className="text-center py-8 mt-12 text-medium-text">
        <p>&copy; {new Date().getFullYear()} 30분 요리 도우미. Powered by Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;
