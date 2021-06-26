import * as React from "react";
import { useState } from "react";

type Prop = {
  name: string;
};

const ButtonMenu: React.FC<Prop> = ({ name }) => {
  const flip_radio_name = `button_menu_${name}`
  return(
    <>
      <div>
        連射
        <div>
          <label><input type="radio" name={flip_radio_name} value="always"/>常に連打する</label>
          <label><input type="radio" name={flip_radio_name} value="if_puressed"/>このボタンを押している時だけ連打する</label>
          <label><input type="radio" name={flip_radio_name} value="if_puressed_some_buttons"/>特定のキーを押したときだけ</label>
        </div>
        <br />
        その他
        <div>
          <label><input type="checkbox" />連射中は特定の入力を無視する</label>
        </div>
      </div>
    </>
  )
}

export const SettingButton: React.FC<Prop> = ({ name }) => {
  const [openMenu, toggleMenu] = useState(false);
  const handleToggle = () => {
    toggleMenu(!openMenu);
  }
  const menu = () => {
    ButtonMenu
  }

  return (
    <>
      <li>
        <label><input type="checkbox" onClick={handleToggle}/>{name}</label>
        {openMenu && <ButtonMenu name={name} />}
      </li>
    </>
  );
};

