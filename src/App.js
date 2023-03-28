import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./styles/styleCode";

import UserEditor from "./pages/UserEditor";
import OutputResult from "./pages/OutputResult";
import GlobalStyle from "./styles/GlobalStyle";

const Main = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.theme.background};
`;

const Header = styled.div`
  width: 100vw;
  height: 50px;
  display: inline-block;
  background-color: ${(props) => props.theme.defaultColor};
`;

const LeftContainer = styled.div`
  width: 50%;
  float: left;
  flex-direction: column;
  padding: 5px 0px;
`;

const RightContainer = styled.div`
  width: 50%;
  float: right;
  flex-direction: column;
  padding: 5px 0px;
`;

export default function App() {
  const [theme, setTheme] = useState(darkTheme);
  const themeType = useSelector((state) => state.appTheme.colorTheme);

  useEffect(() => {
    if (themeType === "dark") {
      setTheme(darkTheme);
    } else if (themeType === "light") {
      setTheme(lightTheme);
    }
  }, [themeType]);

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Header></Header>
        <Main>
          <LeftContainer>
            <UserEditor />
          </LeftContainer>
          <RightContainer>
            <OutputResult />
          </RightContainer>
        </Main>
      </ThemeProvider>
    </>
  );
}
