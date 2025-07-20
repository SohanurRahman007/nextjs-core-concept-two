import Link from "next/link";
import MealSearchInput from "./components/MealSearchInput";

export const metadata = {
  title: "All Meals",
  description: "Meal data fetching by mealsDb",
};

export default async function MealsPage({ searchParams }) {
  // Corrected: No need to await searchParams
  const query = searchParams;
  // Destructure search directly for clarity
  const searchTerm = query.search || "";

  const fetchMeals = async () => {
    try {
      const res = await fetch(
        // Use searchTerm directly
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
      );

      if (!res.ok) {
        // Log the error but continue to return an empty array for graceful rendering
        console.error(`HTTP error! Status: ${res.status}`);
        return [];
      }

      const data = await res.json();

      return data.meals || []; // This ensures 'meals' will always be an array
    } catch (error) {
      console.error("Error fetching meals:", error);
      return []; // Return empty array on any fetch error
    }
  };

  const meals = await fetchMeals(); // meals will now always be an array

  return (
    <>
      <MealSearchInput />
      <div className="grid grid-cols-4 gap-5">
        {meals.map((singleMeal) => {
          return (
            <div key={singleMeal?.idMeal}>
              <h1 className="text-2xl font-semibold">{singleMeal?.strMeal}</h1>
              <p>{singleMeal?.strInstructions}</p>
              <Link href={`/meals/${singleMeal.idMeal}`}>Details</Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
