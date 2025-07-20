// Function to fetch a single meal by ID
const fetchSingleMeals = async (id) => {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    if (!res.ok) {
      console.error(`HTTP error! Status: ${res.status} for ID: ${id}`);
      // Throw an error to trigger Next.js's error.js if present,
      // or to handle it gracefully in the component.
      // For metadata, throwing might just lead to a generic error page.
      return []; // Returning empty array if not OK
    }

    const data = await res.json();

    // The API returns { "meals": [{...}] } or { "meals": null }
    // We want to return the single meal object, or null/undefined if not found.
    // data.meals is an array, so we return the first element or null.
    return data.meals ? data.meals[0] : null; // <--- CRITICAL FIX HERE
  } catch (error) {
    console.error(`Error fetching single meal ${id}:`, error);
    // If an error occurs, return null, so the calling component/metadata knows
    return null;
  }
};

// --- generateMetadata for SEO ---
export async function generateMetadata({ params }) {
  // FIX 1: No need to await params. Destructure directly.
  const { id } = params;

  // fetch data
  // Now, fetchSingleMeals returns the object or null
  const singleMeal = await fetchSingleMeals(id);

  // FIX 2: Check if singleMeal exists before accessing properties
  if (singleMeal) {
    return {
      title: singleMeal.strMeal,
      description: singleMeal.strInstructions?.substring(0, 150) + "...", // Trim description for meta tag
    };
  } else {
    // Provide fallback metadata if meal is not found
    return {
      title: "Meal Not Found",
      description: "The requested meal could not be found.",
    };
  }
}

// --- MealsSinglePage Component ---
export default async function MealsSinglePage({ params }) {
  // FIX 3: Destructure id directly, no need for 'p' variable or 'await'
  const { id } = params;

  // Fetch the single meal
  // Now, fetchSingleMeals returns the object or null
  const singleMeal = await fetchSingleMeals(id);

  // Render content or "Not Found" message
  if (!singleMeal) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Meal Not Found</h1>
        <p className="text-lg text-gray-700">
          The meal with ID "{id}" could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-white rounded-lg shadow-xl">
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        {singleMeal.strMeal}
      </h1>

      {/* Image (if available) */}
      {singleMeal.strMealThumb && (
        <img
          src={singleMeal.strMealThumb}
          alt={singleMeal.strMeal}
          className="w-full h-auto max-h-96 object-cover rounded-lg mb-8 shadow-md"
        />
      )}

      {/* Category and Area */}
      <div className="flex flex-wrap items-center gap-4 text-gray-600 text-lg mb-6">
        {singleMeal.strCategory && (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            Category: {singleMeal.strCategory}
          </span>
        )}
        {singleMeal.strArea && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
            Area: {singleMeal.strArea}
          </span>
        )}
      </div>

      {/* Instructions */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Instructions</h2>
      <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-line">
        {singleMeal.strInstructions}
      </p>

      {/* Tags (if available) */}
      {singleMeal.strTags && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {singleMeal.strTags.split(",").map((tag) => (
              <span
                key={tag.trim()}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* YouTube Video (if available) */}
      {singleMeal.strYoutube && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Watch on YouTube:
          </h3>
          <div
            className="relative"
            style={{ paddingBottom: "56.25%", height: 0 }}
          >
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
              src={`https://www.youtube.com/embed/${
                singleMeal.strYoutube.split("v=")[1]
              }`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Source (if available) */}
      {singleMeal.strSource && (
        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
          <a
            href={singleMeal.strSource}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Original Recipe Source
          </a>
        </div>
      )}
    </div>
  );
}
