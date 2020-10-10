// Redux: defines actions will be dispatched
export const increment = {
  type: "counter/increment",
};

export const signIn = (user) => {
  return {
    type: "user/sign-in",
    payload: { ...user },
  };
};
