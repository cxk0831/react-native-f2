import React from 'react'
import {WebView} from "react-native-webview";
import {Platform, View, Dimensions} from "react-native";

export class util {
    static deviceWindow = Dimensions.get('window')

    static sourceObj = Platform.select({
        ios: require('../lib/index.html'),
        android: { uri: 'file:///android_asset/${libraryName}/index.html' }
    })

    static createChat = (jsString) => (props) => {
        const { style } = props
        return(
            <View style={[{ width: util.deviceWindow.width, height: util.deviceWindow.height }, style]}>
                <WebView
                    scalesPageToFit={true}
                    scrollEnabled={true}
                    source={util.sourceObj}
                    injectedJavaScript={jsString}
                    domStorageEnabled = {true}
                />
            </View>
        )
    }
}
