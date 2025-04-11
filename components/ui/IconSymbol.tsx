// This file is a fallback for using MaterialIcons on Android and web.

import { Icon } from "@/types/app";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { OpaqueColorValue, StyleProp, ViewStyle } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
}: {
  name: Icon;
  size?: number;
  color: string | OpaqueColorValue;
}) {
  switch (name) {
    case "book":
      return <MaterialIcons name="book" size={size} color={color} />;
    case "cherry":
      return <MaterialCommunityIcons name="fruit-cherries" size={size} color={color} />;
    case "save":
      return <FontAwesome name="bookmark-o" size={size} color={color} />;
    case "saved":
      return <FontAwesome name="bookmark" size={size} color={color} />;
    case "like":
      return <MaterialIcons name="thumb-up" size={size} color={color} />;
    case "explore":
      return <MaterialIcons name="explore" size={size} color={color} />;
    case "settings":
      return <MaterialIcons name="settings" size={size} color={color} />;
    case "menu":
      return <MaterialIcons name="menu" size={size} color={color} />;
    case "order":
      return <MaterialIcons name="sort" size={size} color={color} />;
    case "search":
      return <MaterialIcons name="search" size={size} color={color} />;
    case "account":
      return <MaterialIcons name="account-circle" size={size} color={color} />;
    case "time":
      return <MaterialIcons name="access-time" size={size} color={color} />;
    case "left-arrow":
      return <MaterialIcons name="arrow-back" size={size} color={color} />;
    case "right-arrow":
      return <MaterialIcons name="arrow-forward" size={size} color={color} />;
    case "arrow-down":
      return <MaterialIcons name="arrow-downward" size={size} color={color} />;
    case "close":
      return <MaterialIcons name="close" size={size} color={color} />;
    case "share":
      return <MaterialIcons name="share" size={size} color={color} />;
    case "download":
      return <MaterialIcons name="file-download" size={size} color={color} />;
    case "lock":
      return <Feather name="lock" size={size} color={color} />;
    case "help":
      return <Feather name="help-circle" size={size} color={color} />;
    case "trash":
      return <Feather name="trash-2" size={size} color={color} />;
    case "warning":
      return <Feather name="alert-circle" size={size} color={color} />;
    case "mail":
      return <Feather name="mail" size={size} color={color} />;
    case "globe":
      return <Feather name="globe" size={size} color={color} />;
    case "checkmark":
      return <Feather name="check-circle" size={size} color={color} />;
    case "info":
      return <Feather name="info" size={size} color={color} />;
    case "sun":
      return <Feather name="sun" size={size} color={color} />;
    case "moon":
      return <Feather name="moon" size={size} color={color} />;
    case "font":
      return <MaterialIcons name="format-size" size={size} color={color} />;
    case "star":
      return <MaterialIcons name="star" size={size} color={color} />;
    case "play":
      return <MaterialIcons name="play-arrow" size={size} color={color} />;
    case "watch-ads":
      return <MaterialIcons name="ondemand-video" size={size} color={color} />;
    case "diamond":
      return <Ionicons name="diamond" size={size} color={color} />;
    case "heart":
      return <AntDesign name="heart" size={size} color={color} />;
    case "heart_empty":
      return <AntDesign name="hearto" size={size} color={color} />;
    case "question":
      return <MaterialIcons name="help" size={size} color={color} />;
    case "google":
      return <AntDesign name="google" size={size} color={color} />;
    case "apple":
      return <AntDesign name="apple1" size={size} color={color} />;
    case "edit":
      return <Feather name="edit-2" size={size} color={color} />;
    case "search":
      return <FontAwesome name="search" size={size} color={color} />;
    case "sort":
      return <FontAwesome name="sort" size={size} color={color} />;
    case "bell":
      return <Feather name="bell" size={size} color={color} />;
    case "document":
      return <Feather name="file-text" size={size} color={color} />;
    case "shield":
      return <Feather name="shield" size={size} color={color} />;
    case "logout":
      return <Feather name="log-out" size={size} color={color} />;
    case "fire":
      return <FontAwesome5 name="fire" size={size} color={color} />;
    case "eye":
      return <Feather name="eye" size={size} color={color} />;
    case "tv":
      return <Feather name="tv" size={size} color={color} />;
    case "error":
      return <MaterialIcons name="error" size={size} color={color} />;
    case "comment":
      return <MaterialIcons name="comment" size={size} color={color} />;
    case "bookmark":
      return <MaterialIcons name="bookmark" size={size} color={color} />;
    case "gift":
      return <Feather name="gift" size={size} color={color} />;
    default:
      return <MaterialIcons name="error" size={size} color={color} />;
  }
}
