import { useAuth } from "../../util/AuthProvider";

const Survey = () => {
  const auth = useAuth();

  const handleClick = () => {
    auth.logout();
  };

  return (
    <div>
      <button onClick={handleClick}>Sign out</button>
    </div>
  );
};

export default Survey;
