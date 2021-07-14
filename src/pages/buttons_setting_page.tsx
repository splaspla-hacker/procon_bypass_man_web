/** @jsx jsx */

import { jsx, css } from '@emotion/react'
import React, { useState, useEffect, useContext } from "react";
import { ButtonsSetting } from "../components/buttons_setting";
import { Button } from "../types/button";
import { LayerKey } from "../types/layer_key";
import { HttpClient } from "../lib/http_client";
import { ButtonsSettingContext } from "./../contexts/buttons_setting";

type Prop = {};

const httpClient = new HttpClient();

interface LayerRef {
  setVisibility(status: string): string;
};

export const ButtonsSettingPage = ({}:Prop) => {
  const settingContext = useContext(ButtonsSettingContext);
  const layerKeys: Array<LayerKey> = ["up", "right", "down", "left"];
  const [debugConsole, setDebugConsole] = useState("");
  const [prefixKey, setPrefixKey] = useState<Array<Button>>(settingContext.prefix_keys_for_changing_layer);
  const layerRefs = layerKeys.map((l) => ({} as LayerRef));
  const switchLayer = (event:  React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (event !== null && event.target instanceof HTMLElement) {
      layerRefs.forEach(r => r.setVisibility("hidden"));
      layerRefs[
        Number(event.target.dataset.layerKeyIndex)
      ].setVisibility("show");
    }
  }

  useEffect(() => {
    httpClient.getSetting()
      .then(function (response) {
        setPrefixKey(response.data.setting.prefix_keys_for_changing_layer)
        layerKeys.forEach((key) => { settingContext.layers.up[key] = response.data.setting_group_by_button.layers[key] });
        console.log(response.data.setting["layers"][layerKeys[0]]);
        setDebugConsole("<設定ファイルの取得に成功しました>");
        console.log("context:", settingContext);
      })
    layerRefs[0].setVisibility("show");
  }, []);

  return (
    <>
      <hr />
      <h2>設定ファイルの変更</h2>
      {debugConsole}

      <div>設定中のプレフィックスキー: {prefixKey.join(", ")}</div>
      <ul>
        {layerKeys.map((l, index) => (
          <li key={l}>
            <a data-layer-key-index={index} onClick={switchLayer}>{l}</a>
          </li>
        ))}
      </ul>
      {layerKeys.map((l, index) => (<ButtonsSetting key={index} layerKey={l} layerRef={layerRefs[index]} />))}
    </>
  )
}
