import Router from "next/router";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

import { CacheProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import NProgress from 'nprogress';
import "nprogress/nprogress.css";

import "react-toastify/dist/ReactToastify.css";

import "../global/common.css";

import { createEmotionCache } from "../utils/create-emotion-cache";
import { imageBaseUrl } from "src/utils/endpoint";
import { theme } from "src/theme";


import UserContext from "src/context/userContext";


import auth from "src/services/auth";

import Head from "next/head";


NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 500,
  showSpinner: false,
});


const clientSideEmotionCache = createEmotionCache();
const App = ({ ...props }) => {


  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [user, setUser] = useState(auth.getUser());
  const [loading, setLoading] = useState(true);
  const userValue = { user, setUser };


  useEffect(() => {
    Router.events.on('routeChangeStart', () => {
      NProgress.start();
    });
    Router.events.on('routeChangeComplete', () => {
      NProgress.done();

    });
    Router.events.on('routeChangeError', () => {
      NProgress.done();

    });

    return () => {
      Router.events.off('routeChangeStart', () => {
        NProgress.done();
      });
      Router.events.off('routeChangeComplete', () => {
        NProgress.done();
      });
      Router.events.off('routeChangeError', () => {
        NProgress.done();
      });
    };

  }, []);

  useEffect(() => {
    setLoading(false);
    return () => {
      setLoading(false);

    };
  }, []);


  const getLayout = Component.getLayout ?? ((page) => page);

  if (loading) {
    return null;
  }

  return (
    // <React.StrictMode>
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" href={system?.["favicon"] ? imageBaseUrl + system?.["favicon"] : "/favicon.ico"} />
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        draggable={false}
        pauseOnVisibilityChange
        closeOnClick
        pauseOnHover
      />
      <ThemeProvider theme={theme}>

        <UserContext.Provider value={userValue}>
          <CssBaseline />
          {getLayout(
            <Component
              {...pageProps}
              system={system || []}
              user={user || ""}
            />
          )}
        </UserContext.Provider>
      </ThemeProvider >
    </CacheProvider >
    // </React.StrictMode>
  );

};



export default App;
