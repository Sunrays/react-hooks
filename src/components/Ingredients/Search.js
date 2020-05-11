import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const {onLoadIngredients} = props;
  const inputRef = useRef();
  
  // HTTP call for ingredients from DB
  // Acts like componentDidMount because of [] at the end
  useEffect(() => {
    // setTimeout to wait for keystroke for 500ms and then fetch api
    const timer = setTimeout(() => {
      // enteredFilter is previous keystroke value because of closure
      // compare prev value with current value. If user stopped typing, the values will be same.
      if(enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-update-ff9f4.firebaseio.com/ingredients.json' + query)
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
      
          onLoadIngredients(loadedIg);
        })
      }
    }, 500);

    // ref cleanup. return() runs before next call of useEffect
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef])
  
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          < input type = "text"
          value = {
            enteredFilter
          }
          onChange = {
            event => setEnteredFilter(event.target.value)
          }
          ref = {
            inputRef
          }
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
