import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { IconButton, Text } from 'react-native-paper'
import { usePaperColorScheme } from '../theme/theme'
import normalize, { SCREEN_WIDTH } from 'react-native-normalize'

type AddRemoveProps = {
    remove: () => void
    add: () => void
    value: number
    isAddDisabled?: boolean
}

const AddRemove = ({ add, remove, value, isAddDisabled }: AddRemoveProps) => {
    const theme = usePaperColorScheme()

    return (
        <View style={{
            flexDirection: "row",
            position: "absolute",
            left: 170,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center"
        }}>
            <IconButton style={{
                borderTopRightRadius: 6,
                borderBottomRightRadius: 6
            }} icon="minus-thick" onPress={remove} mode="contained" iconColor={theme.colors.onErrorContainer} containerColor={theme.colors.errorContainer} size={20} />
            <View style={{
                width: normalize(40),
                height: "75%",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                borderRadius: 8,
                backgroundColor: theme.colors.vanillaSecondaryContainer,
                // borderStyle: "dashed",
                // borderWidth: 1
            }}>
                <Text variant='bodyMedium' style={{ color: theme.colors.onVanillaSecondaryContainer }}>{value}</Text>
            </View>
            <IconButton disabled={isAddDisabled} style={{
                borderBottomLeftRadius: 6,
                borderTopLeftRadius: 6
            }} icon="plus-thick" onPress={add} mode="contained" iconColor={theme.colors.onVanillaTertiaryContainer} containerColor={theme.colors.vanillaTertiaryContainer} size={20} />
        </View>
    )
}

export default AddRemove

const styles = StyleSheet.create({})