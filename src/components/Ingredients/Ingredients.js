import React, {useReducer, useEffect, useCallback, useMemo} from 'react';
import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';


// currentIngredients is a state
const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ig => ig.id !== action.id);
    default:
      throw new Error('This should not supposed to run');
  }
}

const httpReducer = (httpState, action) => {
  switch(action.type) {
    case 'SEND':
      return {loading: true, error: null};
    case 'RESPONSE':
      return {...httpState, loading: false}
    case 'ERROR':
      return {loading: false, error: action.errorMessage}
    case 'CLEAR':
      return {...httpState, error: null}
    default:
      throw new Error('This should not run');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatchIngredients] = useReducer(ingredientReducer, []);
// useReducer instead of useState which depend on another useState.
  // const [userIngredient, setUserIngredient] = useState([]);

  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});
/*   const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(); */
 
  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

// no need this useEffect because Search component also calls this HTTP request
/*   useEffect(() => {
    fetch('https://react-hooks-update-ff9f4.firebaseio.com/ingredients.json')
    .then(response => response.json())
    .then(responseData => {
      const loadedIg = [];
      for(const key in responseData) {
        loadedIg.push({
          id: key,
          title: responseData[key].title,
          amount: responseData[key].amount
        })
      }
      setUserIngredient(loadedIg)
    })
  }, []); */

  // useCallback to cache function so that it won't re-run. Avoids infinite loop
  const filteredIngredientsHandler = useCallback(filteredIngredients => dispatchIngredients({
    type: 'SET',
    ingredients: filteredIngredients
  }), []);
  // const filteredIngredientsHandler = useCallback(filteredIngredients => setUserIngredient(filteredIngredients),[]);

  const addIngredientHandler = useCallback(ingredient => {
    console.log('ADD INGREDIENTS RENDER');

    dispatchHttp({type:'SEND'});
    // setIsLoading(true);
    fetch('https://react-hooks-update-ff9f4.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      dispatchHttp({type:'RESPONSE'});
      // setIsLoading(false);
      return response.json();
    })
    .then(responseData => {
      dispatchIngredients({
        type: 'ADD',
        ingredient: {
          id: responseData.name,
          ...ingredient
        }
      });
      // current state depends on prevIngredientState. use case for useReducer. so commented
/*       setUserIngredient(prevIngredientState => [...prevIngredientState, {
        id: responseData.name,
        ...ingredient
      }]) */
    })
    .catch(err => dispatchHttp({type:'ERROR', errorMessage: err.message}))
    // .catch(err => setError(err.message));
  }, [])

  const removeIngredientHandler = useCallback(clickedId => {
    console.log('REMOVE INGREDIENTS RENDER');

    dispatchHttp({type:'SEND'});
    // setIsLoading(true);
    fetch(`https://react-hooks-update-ff9f4.firebaseio.com/ingredients/${clickedId}.json`, {
      method: 'DELETE'
    })
    .then(response => {
      dispatchHttp({type:'RESPONSE'});
      // setIsLoading(false);
      dispatchIngredients({type:'DELETE', id:clickedId});
      // setUserIngredient(prevIngredientState => prevIngredientState.filter(item => item.id !== clickedId))
    })
    .catch(err => dispatchHttp({type:'ERROR', errorMessage: err.message}));
    // .catch(err => setError(err.message));
  }, []);

  const clearModalHandler = () => {
    dispatchHttp({type:'CLEAR'});
    // setError(null);
    // setIsLoading(false);
  }

  const ingredientsList = useMemo(() => {
    return(
      < IngredientList ingredients = {
        userIngredients
      }
      onRemoveItem = {
        removeIngredientHandler
      }
      />
    )
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearModalHandler}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm onAddIngredient={addIngredientHandler} onLoading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientsList}
      </section>
    </div>
  );
}

export default Ingredients;
