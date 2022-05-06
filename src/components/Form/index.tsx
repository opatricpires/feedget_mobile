import React, { useState } from "react";
import { ArrowLeft } from "phosphor-react-native";
import { View, TextInput, Image, Text, TouchableOpacity } from "react-native";
import { theme } from "../../theme";
import { FeedbackTypes } from "../Widget/types";
import { feedbackTypes } from "../../utils/feedbackTypes";
import { captureScreen } from "react-native-view-shot";

import { styles } from "./styles";
import { ScreenshotButton } from "../ScreenshotButton";
import { Button } from "../Button";
import { api } from "../../libs/api";
import * as FileSystem from "expo-file-system";

interface FormProps {
  feedbackType: FeedbackTypes;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}

export function Form({
  feedbackType,
  onFeedbackCanceled,
  onFeedbackSent,
}: FormProps) {
  const feedbackTypeInfo = feedbackTypes[feedbackType];
  const [screenShot, setScreenShot] = useState<string | null>(null);
  const [isSendingFeedback, setIsSendingFeedback] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  function handleScreenshot() {
    captureScreen({
      format: "jpg",
      quality: 0.8,
    })
      .then((uri) => setScreenShot(uri))
      .catch((err) => console.log(err));
  }

  function handleScreenshotRemove() {
    setScreenShot(null);
  }

  async function handleSendFeedback() {
    if (isSendingFeedback) return;

    setIsSendingFeedback(true);

    const screenShotBase64 =
      screenShot &&
      (await FileSystem.readAsStringAsync(screenShot, { encoding: "base64" }));

    try {
      console.log({
        type: feedbackType,
        screenshot: `data:image/png;base64, ${screenShotBase64}`,
        comment,
      });

      await api.post("/feedbacks", {
        type: feedbackType,
        screenshot: `data:image/png;base64, ${screenShotBase64}`,
        comment,
      });

      onFeedbackSent();
    } catch (error) {
      console.log("ERROR --->", error);
      setIsSendingFeedback(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft
            size={24}
            weight="light"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image source={feedbackTypeInfo.image} style={styles.image} />
          <Text style={styles.titleText}>{feedbackTypeInfo.title}</Text>
        </View>
      </View>

      <TextInput
        multiline
        style={styles.input}
        placeholder="Descreva o seu feedback..."
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
      />

      <View style={styles.footer}>
        <ScreenshotButton
          onTakeShot={handleScreenshot}
          onRemoveShot={handleScreenshotRemove}
          screenshot={screenShot}
        />
        <Button isLoading={isSendingFeedback} onPress={handleSendFeedback} />
      </View>
    </View>
  );
}
