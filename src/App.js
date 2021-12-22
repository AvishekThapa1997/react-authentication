import { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { AuthContext } from "./store/AuthContextProvider";

function App() {
  const { authState } = useContext(AuthContext);
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        {!authState.token && (
          <Route path="/auth">
            <AuthPage />
          </Route>
        )}
        {authState.token && (
          <Route path="/profile">
            <UserProfile />
          </Route>
        )}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
