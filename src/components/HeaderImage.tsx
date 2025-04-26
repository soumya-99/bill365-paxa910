import { PropsWithChildren } from "react"
import {
  ImageBackground,
  useColorScheme,
  StyleSheet,
  PixelRatio,
  View,
} from "react-native"
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from "react-native-normalize"
import { IconButton, Text } from "react-native-paper"
import { usePaperColorScheme } from "../theme/theme"
import { CommonActions, useNavigation } from "@react-navigation/native"

type HeaderImageProps = {
  imgLight: { uri: string }
  imgDark?: { uri: string }
  borderRadius?: number
  blur?: number
  isBackEnabled?: boolean
  isBackCustom?: boolean
  backPressed?: () => void
}

export default function HeaderImage({
  imgLight,
  imgDark,
  borderRadius,
  blur,
  children,
  isBackEnabled,
  isBackCustom = false,
  backPressed,
}: PropsWithChildren<HeaderImageProps>) {
  const colorScheme = useColorScheme()
  const theme = usePaperColorScheme()

  const navigation = useNavigation()
  return (
    <>
      {isBackEnabled && (
        <View>
          <IconButton
            icon="arrow-left"
            iconColor={theme.colors.onBackground}
            size={20}
            onPress={
              !isBackCustom
                ? () => navigation.dispatch(CommonActions.goBack())
                : () => backPressed()
            }
            style={{
              position: "absolute",
              top: SCREEN_HEIGHT / 40,
              right: SCREEN_WIDTH / 3.2,
              zIndex: 10,
            }}
          />
        </View>
      )}
      <ImageBackground
        imageStyle={{ borderRadius: normalize(borderRadius) }}
        blurRadius={blur}
        source={colorScheme !== "dark" ? imgLight : imgDark}
        style={styles.surface}>
        <Text
          variant="displaySmall"
          style={{ fontFamily: "ProductSans-Medium", textAlign: "center" }}>
          {children}
        </Text>
      </ImageBackground>
    </>
  )
}

const styles = StyleSheet.create({
  surface: {
    margin: normalize(20),
    padding: normalize(25),
    // height: PixelRatio.roundToNearestPixel(200),
    height: SCREEN_HEIGHT / 3.7,
    borderRadius: normalize(30),
    // width: PixelRatio.roundToNearestPixel(330),
    width: SCREEN_WIDTH / 1.13,
    alignItems: "center",
    justifyContent: "center",
  },
})
