/** @jsx jsx */

import { jsx } from '@emotion/react'
import React from "react";
import { useState, useEffect } from "react";
import { SettingButton } from "setting_button";
import { HttpClient } from "../lib/http_client";
import { css } from '@emotion/react'

type Prop = {
};
const httpClient = new HttpClient();

export const GlobalSetting = ({}:Prop) => {
  const [dirPath, setDirPath] = useState("");
  const [settingPath, setSettingPath] = useState("未設定");

  useEffect(() => {
    setDirPath(httpClient.getDirPath());
    setSettingPath(httpClient.getSettingPath());
  })

  const handleSubmit = () => {
    console.log("send");
  }

  return (
    <>
      <h2>設定</h2>
      <label>PBMのディレクトリパス: <input type="text" value={dirPath} /></label>
      <input type="submit" value="更新する" onClick={handleSubmit} />
      <hr />

      <label>PBMの設定ファイルパス: {settingPath}</label>
      <hr />
    </>
  )
}
