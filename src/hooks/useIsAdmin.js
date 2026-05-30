const useIsAdmin = () => {
  return localStorage.getItem("is_admin") === "true";
};

export default useIsAdmin;