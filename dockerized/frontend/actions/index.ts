export const setUser = (user) => {
  return {
    type: "user/set-user",
    payload: { ...user },
  };
};

export default { setUser };
