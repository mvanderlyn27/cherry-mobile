import React from "react";
import { TouchableOpacity } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { Icon } from "@/types/app";

type HeaderActionButtonProps = {
  icon: Icon;
  onPress: () => void;
  side: "left" | "right";
};

const HeaderActionButton = ({ icon, onPress, side }: HeaderActionButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} className={side === "left" ? "mr-4" : "ml-4"}>
      <IconSymbol name={icon} size={32} color="#E57373" />
    </TouchableOpacity>
  );
};

export default HeaderActionButton;
