const useIsAdmin = () => {
  return localStorage.getItem("role") === "SUPERADMIN";
};

export default useIsAdmin;