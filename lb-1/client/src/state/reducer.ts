interface FormState {
  input: string;
  error: string;
  response: string;
  loading: boolean;
}

interface Action {
  type: "SET_INPUT" | "SET_ERROR" | "SET_RESPONSE" | "SET_LOADING";
  payload?: string;
}

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.payload || "" };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload ?? "Unknown error",
        loading: false,
      };
    case "SET_RESPONSE":
      return {
        ...state,
        response: action.payload!,
        error: "    ",
        loading: false,
      };
    case "SET_LOADING":
      return { ...state, loading: true, error: "", response: "" };
    default:
      return state;
  }
}

export { reducer };
