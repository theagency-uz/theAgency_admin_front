import React, { useState, useEffect, Component, useContext } from "react";

const UserContext = React.createContext({
  user: null,
  setUser: () => {},
});

export default UserContext;
