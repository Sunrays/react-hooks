import React, {useState} from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from '../UI/LoadingIndicator';

const IngredientForm = React.memo(props => {
  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({title:enteredTitle, amount:enteredAmount});
  };

  const [enteredTitle, setTitleState] = useState('');
  const [enteredAmount, setAmountState] = useState(0);

  console.log('INGREDIENTS FORM RENDER');

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={enteredTitle}
            onChange={event => setTitleState(event.target.value)} 
/*               onChange={event => {
// event.target won't be updated due to closure. So assign it to new var.
                const newTitle = event.target.value;
// preInputState to trigger updated state (incase there is delay)
                setInputState(prevInputState => ({
                  title: newTitle,
                  amount: prevInputState.amount
                }));
              }} */
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={enteredAmount}
            onChange={event => setAmountState(event.target.value)}
/*               onChange={event=>{
                const newAmount = event.target.value;
                setInputState(prevInputState =>({
                  amount: newAmount,
                  title:prevInputState.title
                }))
              }} */
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.onLoading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
