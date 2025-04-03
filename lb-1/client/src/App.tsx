import { useReducer } from "react";
import { reducer } from "./state/reducer";
import { Service } from "./service/service";

import "./App.css";

function App() {
  const [state, dispatch] = useReducer(reducer, {
    input: "",
    error: "",
    response: "",
    loading: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_LOADING" });

    try {
      const word = await Service.getLongestWord(state.input);
      dispatch({ type: "SET_RESPONSE", payload: word });
    } catch (err: unknown) {
      dispatch({ type: "SET_ERROR", payload: (err as Error).message });
    }
  };

  return (
    <main>
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={state.input}
            onChange={(e) =>
              dispatch({ type: "SET_INPUT", payload: e.target.value })
            }
            placeholder="Enter text..."
          />
          <button type="submit" className="submit-btn" disabled={state.loading}>
            {state.loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        {state.error && <p className="error">{state.error}</p>}
        {state.response && (
          <p className="output">Longest word: {state.response}</p>
        )}
      </div>
    </main>
  );
}

export default App;
