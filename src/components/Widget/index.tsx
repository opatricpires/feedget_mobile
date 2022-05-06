import React, { useRef, useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";

import { ChatTeardropDots } from "phosphor-react-native";
import { theme } from "../../theme";
import BottomSheet from "@gorhom/bottom-sheet";
import { Options } from "../Options";
import { Form } from "../Form";
import { Success } from "../Success";
import { FeedbackTypes } from "./types";

function Widget() {
  const [feedbackType, setFeedbackType] = useState<FeedbackTypes | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  function handleOpen() {
    bottomSheetRef.current?.expand();
  }

  function handleResetFeedback() {
    setFeedbackType(null);
    setFeedbackSent(false);
  }

  function handleFeedbackSent() {
    setFeedbackSent(true);
  }

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handleOpen}>
        <ChatTeardropDots
          size={24}
          color={theme.colors.text_on_brand_color}
          weight="light"
        />
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[1, 280]}
        backgroundStyle={styles.modal}
        handleIndicatorStyle={styles.indicator}
      >
        {feedbackSent ? (
          <Success onSendAnotherFeedback={handleResetFeedback} />
        ) : (
          <>
            {feedbackType ? (
              <Form
                feedbackType={feedbackType}
                onFeedbackCanceled={handleResetFeedback}
                onFeedbackSent={handleFeedbackSent}
              />
            ) : (
              <Options onFeedbackTypeChange={setFeedbackType} />
            )}
          </>
        )}
      </BottomSheet>
    </>
  );
}

export default Widget;
