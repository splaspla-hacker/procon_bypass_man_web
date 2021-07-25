import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { GlobalSetting } from "./global_setting_page";
import { BpmPage } from "./bpm_page";
import { ButtonsSettingPage } from "./buttons_setting_page";
import { RecodingModePage } from "./recoding_mode_page";
import { ButtonsSettingContext } from "./../contexts/buttons_setting";
import { ButtonsSettingType, ButtonsInLayer } from "../types/buttons_setting_type";
import { Layers } from "../types/buttons_setting_type";
import { buttons } from "../types/button";

const ButtonsSettingProfile: React.FC = ({children}) => {
  const initLayers: Layers = {
    up: buttons.reduce((a, i) => { a[i] = {}; return a }, {} as ButtonsInLayer),
    right: buttons.reduce((a, i) => { a[i] = {}; return a }, {} as ButtonsInLayer),
    down: buttons.reduce((a, i) => { a[i] = {}; return a }, {} as ButtonsInLayer),
    left: buttons.reduce((a, i) => { a[i] = {}; return a }, {} as ButtonsInLayer),
  }
  const [prefixKeys, setPrefixKeys] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [layers, setLayers] = useState(initLayers);
  const value = {
    loaded,
    setLoaded,
    layers,
    setLayers,
    prefixKeys,
    setPrefixKeys,
  }
  return (
    <ButtonsSettingContext.Provider value={value}>
      {children}
    </ButtonsSettingContext.Provider>
  )
}

export const Top: React.FC = () => {
  return (
    <>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">home</Link>
              </li>
              <li>
                <Link to="/setting">設定</Link>
              </li>
              <li>
                <Link to="/pbm">PBMのステータス</Link>
              </li>
              <li>
                <Link to="/recoding_mode">入力の録画</Link>
              </li>
              <li>
                <Link to="/buttons_setting">ボタン設定(wip)</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route exact path="/" ></Route>
            <Route path="/setting">
              <GlobalSetting />
            </Route>
            <Route path="/pbm">
              <BpmPage />
            </Route>
            <Route path="/buttons_setting">
              <ButtonsSettingProfile><ButtonsSettingPage /></ButtonsSettingProfile>
            </Route>
            <Route path="/recoding_mode">
              <RecodingModePage />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
};
