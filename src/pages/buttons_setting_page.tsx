/** @jsx jsx */

import { jsx, css } from '@emotion/react'
import React, { useState, useEffect, useContext } from "react";
import { ButtonsSetting } from "../components/buttons_setting";
import { Button, buttons } from "../types/button";
import { LayerKey, layerKeys } from "../types/layer_key";
import { ButtonInLayer, ButtonsInLayer, Layers, Flip } from "../types/buttons_setting_type";
import { HttpClient } from "../lib/http_client";
import { ButtonState } from "./../lib/button_state";
import { ButtonsSettingContext, } from "./../contexts/buttons_setting";
import { ButtonsSettingConverter } from "./../lib/buttons_setting_converter";
import { disableFlipType, alwaysFlipType, flipIfPressedSelfType, flipIfPressedSomeButtonsType, ignoreButtonsInFlipingType, remapType, closeMenuType } from "../reducers/layer_reducer";

const httpClient = new HttpClient();

interface LayerRef {
  setVisibility(status: string): string;
};

export const ButtonsSettingPage = () => {
  const { loaded, setLoaded, layers, layersDispatch, prefixKeys, setPrefixKeys } = useContext(ButtonsSettingContext);
  const [selectedLayer, setSelectedLayer] = useState<LayerKey>("up");
  const [debugConsole, setDebugConsole] = useState("");
  const layerRefs = layerKeys.map((l) => ({} as LayerRef));

  const switchLayer = (event:  React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (event.target instanceof HTMLElement) {
      setSelectedLayer(event.target.dataset.layerKey as LayerKey);
      layerRefs.forEach(r => r.setVisibility("hidden"));
      layerRefs[
        Number(event.target.dataset.layerKeyIndex)
      ].setVisibility("shown");
    }
  }
  const exportSetting = () => {
    const body = ButtonsSettingConverter({ prefixKey: prefixKeys, layers: layers }) || ""
    var data = new Blob([body], { type: 'text/yaml' })
    var csvURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'setting.yml');
    tempLink.click();
  }

  useEffect(() => {
    if (loaded) {
      layerRefs[0].setVisibility("shown");
      return;
    }

    httpClient.getSetting()
      .then(function (response) {
        setPrefixKeys(response.data.setting.prefix_keys_for_changing_layer);
        const layers = layerKeys.reduce((a, key) => {
          a[key] = response.data.setting_group_by_button.layers[key];
          return a;
        }, {} as Layers)
        layerKeys.forEach((layerKey) => {
          buttons.forEach((button) => {
            const buttonState = new ButtonState(
              button,
              layers[layerKey][button]?.flip, layers[layerKey][button]?.macro, layers[layerKey][button]?.remap,
            );
            const flip = layers[layerKey][button]?.flip || {} as Flip

            if(layers[layerKey][button] === undefined) {
              layersDispatch({ type: closeMenuType, payload: { layerKey: layerKey, button: button }});
            } else if (layers[layerKey][button].remap?.to) {
              layersDispatch({ type: remapType, payload: { layerKey: layerKey, button: button, targetButtons: layers[layerKey][button].remap?.to }});
            } else if (buttonState.hasFlipSetting()) {
              layersDispatch({ type: ignoreButtonsInFlipingType, payload: { layerKey: layerKey, button: button, targetButtons: flip.force_neutral }});

              if(buttonState.isDisabledFlip()) {
                layersDispatch({ type: disableFlipType, payload: { layerKey: layerKey, button: button }});
              } else if (buttonState.isAlwaysFlip()) {
                layersDispatch({ type: alwaysFlipType, payload: { layerKey: layerKey, button: button }});
              } else if (buttonState.isFlipIfPressedSelf()) {
                layersDispatch({ type: flipIfPressedSelfType, payload: { layerKey: layerKey, button: button }});
              } else if (buttonState.isFlipIfPressedSomeButtons()) {
                layersDispatch({ type: flipIfPressedSomeButtonsType, payload: { layerKey: layerKey, button: button, targetButtons: layers[layerKey][button].flip?.if_pressed }});
              }
            } else {
              console.log("unexpectですです!!!!!!!!!!!!!");
            }
          });
        });

        setDebugConsole("<設定ファイルの取得に成功しました>");
        setLoaded(true);
      })

  }, [loaded]);

  const layersTabStyle = () => {
    return css`
      ul {
        list-style: none;
        display:flex;
        margin: 0;
        padding: 0;
        border-left: 1px solid #aaa;
        margin-bottom: 30px;
        li {
          border-top: 1px solid #aaa;
          border-right: 1px solid #aaa;
          &.active {
            border-bottom: 1px solid #white;
          }
          &.inactive {
            border-bottom: 1px solid #aaa;
          }
          a {
            padding: 20px;
            display: block;
            &:hover {
             cursor:pointer;
            }
          }
        }
      }
    `;
  }
  const liClassName = (layer: LayerKey) => {
    if(layer === selectedLayer) {
      return "active"
    } else {
      return "inactive"
    };
  }

  return (
    <>
      <h2>設定ファイルの変更</h2>
      <div>
        <a href="#" onClick={exportSetting}>エクスポートする</a>
      </div>

      {debugConsole}

      <div>設定中のプレフィックスキー: {prefixKeys.join(", ")}</div>
      <div css={layersTabStyle}>
        <ul>
          {layerKeys.map((l, index) => (
            <li key={l} className={liClassName(l)}>
              <a data-layer-key-index={index} data-layer-key={l} onClick={switchLayer}>{l}</a>
            </li>
          ))}
        </ul>
      </div>

      {loaded && layerKeys.map((l, index) => (<ButtonsSetting key={index} layerKey={l} layerRef={layerRefs[index]} />))}
      {!loaded && "loading..."}
    </>
  )
}
