import React, { useEffect, useMemo, useState } from "react";
import useAxios from "axios-hooks";
import { ChakraProvider } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "antd";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { setPersistence, getAuth, inMemoryPersistence } from "firebase/auth";
import { useLogin, LoadingScreen, AuthProvider, apiUrl, Service } from "@hex-labs/core";
import { ChakraProvider } from '@chakra-ui/react';

import "./App.less";

import Navigation from "./components/navigation/Navigation";
import Dashboard from "./components/dashboard/Dashboard";
import ProjectGallery from "./components/projectGallery/ProjectGallery";
import JudgingHome from "./components/judging/JudgingHome";
import AdminHome from "./components/admin/AdminHome";
import Footer from "./components/navigation/Footer";
import SubmissionFormContainer from "./components/create/SubmissionFormContainer";
import NotFoundDisplay from "./displays/NotFoundDisplay";
import ProjectDetails from "./components/dashboard/ProjectDetails";
import Epicenter from "./components/epicenter/Epicenter";
import CategoryGroup from "./components/categoryGroup/CategoryGroup";
import ProjectStatusHome from "./components/projectStatus/ProjectStatusHome";
import Winners from "./components/winners/WinnersGallery";
import ProtectedRoute from "./util/ProtectedRoute";
import CurrentHexathonContext from "./contexts/CurrentHexathonContext";

const { Content } = Layout;

// Initialized the Firebase app through the credentials provided
export const app = initializeApp({
  apiKey: "AIzaSyCsukUZtMkI5FD_etGfefO4Sr7fHkZM7Rg",
  authDomain: "auth.hexlabs.org",
});
// Sets the Firebase persistence to in memory since we use cookies for session
// management. These cookies are set by the backend on login/logout.
setPersistence(getAuth(app), inMemoryPersistence);

// By default sends axios requests with user session cookies so that the backend
// can verify the user's identity.
axios.defaults.withCredentials = true;

export const App = () => {
  const [loading, loggedIn] = useLogin(app);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [currentHexathon, setCurrentHexathon] = useState<any>(null);
  const hexathonValues = useMemo(
    () => ({ currentHexathon, setCurrentHexathon }),
    [currentHexathon, setCurrentHexathon]
  );

  const [{ data: configData, loading: configLoading, error }] = useAxios(
    apiUrl(Service.EXPO, "/config")
  );

  useEffect(() => {
    const getUserData = async () => {
      const response = await axios.get(apiUrl(Service.EXPO, "/users/check"));
      setUser(response.data);
      setUserDataLoading(false);
    };
    if (configData) {
      setCurrentHexathon(configData.currentHexathon);
    }
    if (loggedIn) {
      getUserData();
    } else {
      setUser(null);
    }
  }, [loggedIn, currentHexathon]);

  if (loading || configLoading) {
    return <LoadingScreen />;
  }

  // If the user is not logged in, redirect to the login frontend with a redirect
  // param so that the user can login and come back to the page they were on.
  if (!loggedIn) {
    window.location.href = `https://login.hexlabs.org?redirect=${window.location.href}`;
    return <LoadingScreen />;
  }

  if (userDataLoading) {
    return <LoadingScreen />;
  }

  return (
    <ChakraProvider>
      <AuthProvider app={app}>
        <CurrentHexathonContext.Provider value={hexathonValues}>
          <Layout style={{ minHeight: "100vh" }}>
            <Navigation user={user} />
            <Content style={{ padding: "25px", backgroundColor: "#fff" }}>
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/create" element={<SubmissionFormContainer user={user} />} />

                <Route
                  path="/category-group/:categoryGroupId"
                  element={
                    <ProtectedRoute type="sponsor" user={user}>
                      <CategoryGroup />
                    </ProtectedRoute>
                  }
                />

                <Route path="/projectgallery" element={<ProjectGallery user={user} />} />
                <Route path="/projects/:projectId" element={<ProjectDetails />} />

                <Route
                  path="/judging"
                  element={
                    <ProtectedRoute type="judge" user={user}>
                      <JudgingHome user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute type="admin" user={user}>
                      <AdminHome />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/:activePane"
                  element={
                    <ProtectedRoute type="admin" user={user}>
                      <AdminHome />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/epicenter"
                  element={
                    <ProtectedRoute type="admin" user={user}>
                      <Epicenter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project-status"
                  element={
                    <ProtectedRoute type="admin" user={user}>
                      <ProjectStatusHome />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/winners"
                  element={
                    <ProtectedRoute type="admin" user={user}>
                      <Winners />
                    </ProtectedRoute>
                  }
                />
                <Route element={<NotFoundDisplay />} />
              </Routes>
            </Content>
            <Footer />
          </Layout>
        </CurrentHexathonContext.Provider>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
