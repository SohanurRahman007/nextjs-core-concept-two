import MealSearchInput from "./components/MealSearchInput";

export default async function MealsPage({ searchParams }) {
  const query = await searchParams;
  const fetchMeals = async () => {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query.search}`
      );
      const data = await res.json();

      //   setMeals(data?.meals || []);
      console.log(data.meals);
      return data.meals;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const meals = await fetchMeals();

  return (
    <>
      <MealSearchInput />
      <div className="grid grid-cols-4 gap-5">
        {meals.map((singleMeal) => {
          return (
            <div key={singleMeal?.idMeal}>
              <h1 className="text-2xl font-semibold">{singleMeal?.strMeal}</h1>
              <p>{singleMeal?.strInstructions}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
