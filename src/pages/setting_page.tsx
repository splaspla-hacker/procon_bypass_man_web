/** @jsx jsx */

import { jsx } from '@emotion/react'
import React, { useState } from "react";
import { css } from '@emotion/react'
import { Setting } from "./../setting";

type Prop = {};
type Button = "a" | "b"| "x"| "y"| "up"| "right"| "down"| "left"| "r"| "l"| "zr"| "zl";

const buttons: Array<Button> = [
  "a", "b", "x", "y", "up", "right", "down", "left", "r", "l", "zr", "zl",
]
// TODO serverから取得する
const prefixKey: Array<Button> = [
  "r", "l", "zr", "zl",
]

export const SettingPage = ({}:Prop) => {
  return (
    <>
      <hr />
      <h2>設定ファイルの変更</h2>
      <Setting buttons={buttons} prefixKey={prefixKey} />
    </>
  )
}
