import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block text-medium-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      {recipe.recipeImageUrl ? (
        <img
          src={recipe.recipeImageUrl}
          alt={`${recipe.recipeName} 이미지`}
          className="w-full h-56 object-cover"
          onError={(e) => {
            // 이미지 로드 실패 시, 해당 이미지 요소를 숨깁니다.
            (e.currentTarget as HTMLImageElement).style.display = 'none';
            // Optionally, we could replace it with the search button here too,
            // but the primary request is for when URL is initially missing.
          }}
        />
      ) : (
        <div className="w-full h-56 bg-gray-100 flex items-center justify-center p-4" aria-label="이미지 없음">
          <a
            href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(recipe.recipeName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-md shadow-md text-center transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75"
            aria-label={`Google에서 ${recipe.recipeName} 이미지 검색`}
          >
            Google에서 '{recipe.recipeName}'<br/>이미지 검색하기
          </a>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-primary mb-3">{recipe.recipeName}</h3>
        <div className="flex items-center text-medium-text mb-4">
          <ClockIcon />
          <span>{recipe.estimatedTime}</span>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-semibold text-dark-text mb-2">
            필수 재료:
          </h4>
          <ul className="list-disc list-inside ml-4 space-y-1 text-medium-text">
            {recipe.requiredIngredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-dark-text mb-2">
            요리 방법:
          </h4>
          <ol className="list-decimal list-inside ml-4 space-y-2 text-medium-text">
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;